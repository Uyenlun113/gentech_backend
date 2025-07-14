import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ct00Entity } from './entity/ct00.entity';
import { Ct11Entity } from './entity/ct11.entity';
import { Ct11GtEntity } from './entity/ct11gt.entity';
import { Ph11Entity } from './entity/ph11.entity';
import { SaveGeneralAccountingDto } from './save-general-accounting.dto';

@Injectable()
export class GeneralAccountingService {
    constructor(
        @InjectRepository(Ph11Entity)
        private readonly ph11Repo: Repository<Ph11Entity>,

        @InjectRepository(Ct11Entity)
        private readonly ct11Repo: Repository<Ct11Entity>,

        @InjectRepository(Ct11GtEntity)
        private readonly ct11gtRepo: Repository<Ct11GtEntity>,

        @InjectRepository(Ct00Entity)
        private readonly ct00Repo: Repository<Ct00Entity>,

        private readonly dataSource: DataSource
    ) { }

    async save(dto: SaveGeneralAccountingDto) {
        const { phieu, hachToan, hopDongThue } = dto;
        const stt_rec = `APK${Date.now()}`.substring(0, 11);
        const ma_dvcs = 'CTY';
        const ma_gd = '1';
        const ma_ct = phieu.so_ct;
        const ngay_ct = new Date(phieu.ngay_lct);

        // Step 2: Lưu PH11 (phiếu)
        await this.ph11Repo.save({
            ...phieu,
            stt_rec,
            ngay_ct,
            ma_ct: phieu.so_ct,
            status: "1"
        });

        // Step 3: Lưu CT11 (hạch toán)
        const validHachToan = Array.isArray(hachToan)
            ? hachToan.filter(ht => Object.values(ht).some(val => val !== null && val !== ''))
            : [];

        if (validHachToan.length > 0) {
            // Xóa dữ liệu cũ nếu có (để giống log)
            await this.ct11Repo.delete({ stt_rec });

            await this.ct11Repo.save(
                validHachToan.map(ht => ({
                    ...ht,
                    stt_rec,
                    ngay_ct,
                }))
            );
        }

        // Step 4: Lưu CT11GT (hóa đơn thuế GTGT)
        const validGT = Array.isArray(hopDongThue)
            ? hopDongThue.filter(gt => Object.values(gt).some(val => val !== null && val !== ''))
            : [];

        if (validGT.length > 0) {
            await this.ct11gtRepo.delete({ stt_rec });

            await this.ct11gtRepo.save(
                validGT.map(gt => ({
                    ...gt,
                    stt_rec,
                }))
            );

            // Step 5: CheckExistsHDVao nếu có GTGT
            const hd = validGT[0];
            try {
                await this.dataSource.query(
                    `EXEC CheckExistsHDVao @stt_rec = @0, @so_ct0 = @1, @so_seri0 = @2, @ngay_ct0 = @3, @ma_so_thue = @4`,
                    [
                        stt_rec,
                        phieu.so_ct || '',
                        hd.so_seri0 || '',
                        phieu.ngay_lct || '',
                        hd.ma_so_thue || '',
                    ]
                );
            } catch (error) {
                console.error('Lỗi CheckExistsHDVao:', error);
                throw new BadRequestException('Hóa đơn GTGT đã tồn tại hoặc không hợp lệ');
            }
        }

        // Step 6: Lưu CT00
        await this.ct00Repo.save({
            ma_ct,
            ma_dvcs,
            ma_gd,
            stt_rec,
            ngay_ct,
            ma_kh: validGT[0]?.ma_kh?.trim() || null,
        });

        // Step 7: CheckData
        try {
            await this.dataSource.query(
                `EXEC [dbo].[GLCTPK1-CheckData] @status = @0, @stt_rec = @1`,
                ['2', stt_rec]
            );
        } catch (error) {
            console.error('Lỗi CheckData:', error);
            throw new BadRequestException('Dữ liệu không hợp lệ khi kiểm tra trước ghi sổ');
        }

        // Step 8: Post
        try {
            await this.dataSource.query(
                `EXEC [dbo].[GLCTPK1-Post] @stt_rec = @0, @ma_ct = @1`,
                [stt_rec, ma_ct]
            );
        } catch (error) {
            console.error('Lỗi ghi sổ:', error);
            throw new BadRequestException('Ghi sổ thất bại');
        }

        return { message: 'Lưu và ghi sổ thành công', stt_rec };
    }


    async update(stt_rec: string, dto: SaveGeneralAccountingDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { phieu, hachToan, hopDongThue } = dto;
            const existingPh11 = await queryRunner.manager.findOne(this.ph11Repo.target, { where: { stt_rec } });

            if (!existingPh11) throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);

            const ma_ct = phieu.so_ct?.trim();
            const ngay_ct = new Date(phieu.ngay_lct);

            // Cập nhật PH11
            await queryRunner.manager.update(this.ph11Repo.target, { stt_rec }, {
                ...phieu,
                ngay_ct,
            });

            // Xóa CT11 cũ
            await queryRunner.query(
                `DELETE FROM CT11 WHERE stt_rec = '${stt_rec}'`
            );

            // Thêm CT11 mới
            const validHachToan = (Array.isArray(hachToan) ? hachToan : []).filter(ht =>
                Object.values(ht).some(val => val !== null && val !== '')
            );
            if (validHachToan.length > 0) {
                await queryRunner.manager.save(this.ct11Repo.target,
                    validHachToan.map(ht => ({
                        ...ht,
                        stt_rec,
                        ngay_ct,
                    }))
                );
            }

            // Xóa CT11GT cũ
            await queryRunner.query(
                `DELETE FROM CT11GT WHERE stt_rec = '${stt_rec}'`
            );

            // Thêm CT11GT mới
            const validHopDongThue = (Array.isArray(hopDongThue) ? hopDongThue : []).filter(gt =>
                Object.values(gt).some(val => val !== null && val !== '')
            );
            if (validHopDongThue.length > 0) {
                await queryRunner.manager.save(this.ct11gtRepo.target,
                    validHopDongThue.map(gt => ({
                        ...gt,
                        stt_rec,
                    }))
                );
            }

            // Cập nhật CT00
            await queryRunner.manager.update(this.ct00Repo.target, { stt_rec }, {
                ma_ct,
                ma_kh: validHopDongThue[0]?.ma_kh?.trim() || null,
                ngay_ct,
            });
            await queryRunner.commitTransaction();
            await this.dataSource.query(
                `EXEC [dbo].[GLCTPK1-Checkdata] @status = '2', @stt_rec = '${stt_rec}'`
            );
            await this.dataSource.query(
                `EXEC [dbo].[GLCTPK1-Post] @stt_rec = '${stt_rec}', @ma_ct = '${ma_ct}'`
            );
            return { message: 'Cập nhật thành công', stt_rec };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }


    async delete(stt_rec: string) {
        // const existingPh11 = await this.ph11Repo.findOne({ where: { stt_rec } });
        // if (!existingPh11) {
        //     throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);
        // }
        // const ma_ct = existingPh11.so_ct.trim();
        // await this.dataSource.query(`EXEC [dbo].[InPostcttt20] @stt_rec = @0`, [stt_rec]);
        // await this.dataSource.query(`
        //     exec sp_executesql 
        //       N'exec [dbo].[CheckEditVouchertt] @stt_rec, @tablename', 
        //       N'@stt_rec char(11), @tablename varchar(20)', 
        //       @stt_rec = @0, 
        //       @tablename = @1
        //   `, [stt_rec, 'cttt20']);
        // await this.dataSource.query(`EXEC [dbo].[InPostcttt30] @stt_rec = @0`, [stt_rec]);
        // await this.dataSource.query(`
        //     exec sp_executesql 
        //       N'exec [dbo].[CheckEditVouchertt] @stt_rec, @tablename', 
        //       N'@stt_rec char(11), @tablename varchar(20)', 
        //       @stt_rec = @0, 
        //       @tablename = @1
        //   `, [stt_rec, 'cttt30']);
        // await this.dataSource.query(`SELECT count(1) FROM dmct WHERE ma_ct like @0 AND ngay_ks = @1`, [ma_ct, new Date()]);
        // await this.dataSource.query(`EXEC DeleteVoucher @cMa_ct = @0, @stt_rec = @1`, [ma_ct, stt_rec]);

        // return { message: 'Xóa thành công theo quy trình chuẩn', stt_rec };

        const existingPh11 = await this.ph11Repo.findOne({ where: { stt_rec } });
        if (!existingPh11) {
            throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);
        }

        // Xóa theo thứ tự ngược lại để tránh lỗi foreign key constraint
        await this.ct11Repo.delete({ stt_rec });
        await this.ct11gtRepo.delete({ stt_rec });
        await this.ct00Repo.delete({ stt_rec });
        await this.ph11Repo.delete({ stt_rec });

        return { message: 'Xóa thành công', stt_rec };
    }


    async findOne(stt_rec: string) {
        const ph11 = await this.ph11Repo.findOne({ where: { stt_rec } });
        if (!ph11) {
            throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);
        }

        const ct11 = await this.ct11Repo
            .createQueryBuilder('ct11')
            .where('ct11.stt_rec = :stt_rec', { stt_rec })
            .getRawMany();
        const ct11gt = await this.ct11gtRepo.find({ where: { stt_rec } });

        return {
            phieu: ph11,
            hachToan: ct11.map(item => ({
                tk_i: item.ct11_tk_i,
                ps_no: item.ct11_ps_no,
                ps_co: item.ct11_ps_co,
                nh_dk: item.ct11_nh_dk,
                dien_giaii: item.ct11_dien_giaii,
                ngay_ct: item.ct11_ngay_item,
                ma_kh_i: item.ct11_ma_kh_i,
            })),
            hopDongThue: ct11gt.map(item => ({
                so_seri0: item.so_seri0,
                so_ct0: item.so_ct0,
                ngay_ct0: item.ngay_ct0,
                ma_kh: item.ma_kh,
                ten_kh: item.ten_kh,
                dia_chi: item.dia_chi,
                ma_so_thue: item.ma_so_thue,
                ty_gia: item.ty_gia,
                ten_vt: item.ten_vt,
                t_tien: item.t_tien,
                thue_suat: item.thue_suat,
                t_thue: item.t_thue,
                t_tt: item.t_tt,
                tk_thue_no: item.tk_thue_no,
                tk_du: item.tk_du,
                ma_thue: item.ma_thue,
                ma_ms: item.ma_ms,
                kh_mau_hd: item.kh_mau_hd,
            }))
        };
    }

    async findAllPh11({ page, limit, search }: { page: number; limit: number; search?: string }) {
        const skip = (page - 1) * limit;

        const queryBuilder = this.ph11Repo.createQueryBuilder('ph11');

        if (search) {
            queryBuilder.where('ph11.ma_ct LIKE :search OR ph11.stt_rec LIKE :search OR ph11.dien_giai LIKE :search', {
                search: `%${search}%`,
            });
        }

        const [items, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('ph11.ngay_ct', 'DESC')
            .getManyAndCount();

        return {
            total,
            page,
            limit,
            items,
        };
    }

    async findAllCt11(stt_rec_input: string | string[]) {
        const stt_rec_list = Array.isArray(stt_rec_input)
            ? stt_rec_input.map((x) => x.trim())
            : stt_rec_input.split(',').map((x) => x.trim());
        const rawData = await this.ct11Repo
            .createQueryBuilder('ct11')
            .where('RTRIM(ct11.stt_rec) IN (:...stt_rec_list)', { stt_rec_list })
            .getRawMany();

        const data = rawData.map((row) => ({
            stt_rec0: row.ct11_stt_rec0,
            stt_rec: row.ct11_stt_rec,
            tk_i: row.ct11_tk_i,
            ps_no: row.ct11_ps_no,
            ps_co: row.ct11_ps_co,
            nh_dk: row.ct11_nh_dk,
            dien_giaii: row.ct11_dien_giaii,
            ngay_ct: row.ct11_ngay_ct,
        }));

        return data;
    }

}