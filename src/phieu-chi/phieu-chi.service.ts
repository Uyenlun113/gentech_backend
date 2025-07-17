import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Ct00Entity } from 'src/general-accounting/entity/ct00.entity';
import { Ct46Entity } from './entity/ct46.entity';
import { Ct46gtEntity } from './entity/ct46gt.entity';
import { Ph46Entity } from './entity/ph46.entity';
import { SaveCt46AccountingDto } from './phieu-chi.dto';


@Injectable()
export class Ct46AccountingService {
    constructor(
        @InjectRepository(Ph46Entity)
        private readonly ph46Repo: Repository<Ph46Entity>,

        @InjectRepository(Ct46Entity)
        private readonly ct46Repo: Repository<Ct46Entity>,

        @InjectRepository(Ct46gtEntity)
        private readonly ct46gtRepo: Repository<Ct46gtEntity>,

        @InjectRepository(Ct00Entity)
        private readonly ct00Repo: Repository<Ct00Entity>,

        private readonly dataSource: DataSource
    ) { }

    async save(dto: SaveCt46AccountingDto) {
        const { phieu, hachToan, hopDongThue } = dto;
        const stt_rec = `PC1${Date.now()}`.substring(0, 11);
        const ma_dvcs = 'CTY';
        const ma_ct = 'PC1';
        const ngay_ct = new Date(phieu.ngay_lct);

        try {
            // Step 1: Kiểm tra số chứng từ hợp lệ
            await this.dataSource.query(
                `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
                [ma_ct, phieu.so_ct, stt_rec]
            );

            // Step 2: Lưu PH46
            await this.ph46Repo.save({
                ...phieu,
                stt_rec,
                ma_ct,
                ngay_ct,
                ma_dvcs,
                status: '1',
            });

            // Step 3: Xử lý dữ liệu hạch toán CT46
            const validHachToan = Array.isArray(hachToan)
                ? hachToan.filter(ht => Object.values(ht).some(val => val !== null && val !== ''))
                : [];

            if (validHachToan.length > 0) {
                await this.ct46Repo.delete({ stt_rec });

                await this.ct46Repo.save(
                    validHachToan.map(ht => ({
                        ...ht,
                        stt_rec,
                        ma_ct,
                    }))
                );
            }

            // Step 4: Xử lý dữ liệu hóa đơn thuế GTGT CT46GT
            const validGT = Array.isArray(hopDongThue)
                ? hopDongThue.filter(gt => Object.values(gt).some(val => val !== null && val !== ''))
                : [];

            if (validGT.length > 0) {
                await this.ct46gtRepo.delete({ stt_rec });

                await this.ct46gtRepo.save(
                    validGT.map(gt => ({
                        ...gt,
                        stt_rec,
                        ma_ct,
                    }))
                );
            }

            // Step 5: Lưu CT00
            await this.ct00Repo.save({
                ma_ct,
                ma_dvcs,
                stt_rec,
                ngay_ct,
                ma_kh: validGT[0]?.ma_kh?.trim() || null,
            });

            // Step 6: Kiểm tra dữ liệu (CheckData)
            await this.dataSource.query(
                `EXEC [dbo].[CACTPC1-CheckData] @status = @0, @stt_rec = @1`,
                ['2', stt_rec]
            );

            // Step 7: Ghi sổ (Post)
            await this.dataSource.query(
                `EXEC [dbo].[CACTPC1-Post] @stt_rec = @0, @ma_ct = @1`,
                [stt_rec, ma_ct]
            );

            return { message: 'Lưu và ghi sổ thành công', stt_rec };
        } catch (error) {
            console.error('Lỗi trong quá trình lưu CT46:', error);
            throw new BadRequestException(`Lỗi xử lý: ${error.message}`);
        }
    }


    async update(stt_rec: string, dto: SaveCt46AccountingDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            console.log('dto', dto);
            const { phieu, hachToan, hopDongThue } = dto;

            const existingPh46 = await queryRunner.manager.findOne(this.ph46Repo.target, {
                where: { stt_rec },
            });
            if (!existingPh46) throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);

            const ma_ct = 'PC1';
            const ngay_ct = new Date(phieu.ngay_lct);

            // ✅ 1. Kiểm tra số chứng từ
            await this.dataSource.query(
                `EXEC CheckValidSoct#3 @Ma_qs = @0, @So_ct = @1`,
                [ma_ct, phieu.so_ct]
            );

            // ✅ 2. Cập nhật PH46
            await queryRunner.manager.update(this.ph46Repo.target, { stt_rec }, {
                ...phieu,
                ngay_ct,
                ma_ct,
            });

            // ✅ 3. Xoá CT46 cũ
            await this.ct46Repo.delete({ stt_rec });

            // ✅ 4. Thêm CT46 mới nếu có dữ liệu
            const validHachToan = (Array.isArray(hachToan) ? hachToan : []).filter(ht =>
                Object.values(ht).some(val => val !== null && val !== '')
            );

            if (validHachToan.length > 0) {
                await queryRunner.manager.save(this.ct46Repo.target,
                    validHachToan.map(ht => ({
                        ...ht,
                        stt_rec,
                        ma_ct,
                        so_ct: phieu.so_ct,
                    }))
                );
            }

            // ✅ 5. Xoá CT46GT cũ
            await this.ct46gtRepo.delete({ stt_rec });

            // ✅ 6. Thêm CT46GT mới nếu có dữ liệu
            const validHopDongThue = Array.isArray(hopDongThue)
                ? hopDongThue.filter(gt => Object.values(gt).some(val => val !== null && val !== ''))
                : [];

            if (validHopDongThue.length > 0) {
                await this.ct46gtRepo.save(
                    validHopDongThue.map(gt => ({
                        ...gt,
                        stt_rec,
                        ma_ct,
                    }))
                );
                console.log(validHopDongThue);
            }

            // ✅ 7. Cập nhật lại bảng CT00
            await queryRunner.manager.update(this.ct00Repo.target, { stt_rec }, {
                ma_ct,
                ma_kh: validHopDongThue[0]?.ma_kh?.trim() || null,
                ngay_ct,
            });

            // ✅ 8. Commit transaction
            await queryRunner.commitTransaction();

            // ✅ 9. Gọi thủ tục xử lý cuối
            await this.dataSource.query(
                `EXEC [dbo].[CACTPC1-CheckData] @status = '2', @stt_rec = '${stt_rec}'`
            );
            await this.dataSource.query(
                `EXEC [dbo].[CACTPC1-Post] @stt_rec = '${stt_rec}', @ma_ct = '${ma_ct}'`
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
        const existingPh46 = await this.ph46Repo.findOne({ where: { stt_rec } });
        if (!existingPh46) {
            throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);
        }

        // Xóa theo thứ tự ngược lại để tránh lỗi foreign key constraint
        await this.ct46Repo.delete({ stt_rec });
        await this.ct46gtRepo.delete({ stt_rec });
        await this.ct00Repo.delete({ stt_rec });
        await this.ph46Repo.delete({ stt_rec });

        return { message: 'Xóa thành công', stt_rec };
    }

    async findOne(stt_rec: string) {
        const ph46 = await this.ph46Repo.findOne({ where: { stt_rec } });
        if (!ph46) {
            throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);
        }

        const ct46 = await this.ct46Repo
            .createQueryBuilder('ct46')
            .where('ct46.stt_rec = :stt_rec', { stt_rec })
            .getRawMany();

        console.log(ct46);
        const ct46gt = await this.ct46gtRepo.find({ where: { stt_rec } });
        return {
            phieu: ph46,
            hachToan: ct46.map(item => ({
                tk_i: item.ct46_tk_i,
                tien: item.ct46_tien,
                thue_suat: item.ct46_thue_suat,
                thue: item.ct46_thue,
                tt: item.ct46_tt,
                dien_giaii: item.ct46_dien_giaii,
                so_ct0: item.ct46_so_ct0,
                tk_thue_i: item.ct46_tk_thue_i,
                loai_hd: item.ct46_loai_hd,
                ma_ms: item.ct46_ma_ms,
                kh_mau_hd: item.ct46_kh_mau_hd,
                ma_kh_t: item.ct46_ma_kh_t,
                so_seri0: item.ct46_so_seri0,
                ten_kh_t: item.ct46_ten_kh_t,
                dia_chi_t: item.ct46_dia_chi_t,
                mst_t: item.ct46_mst_t,
                ten_vt_t: item.ct46_ten_vt_t,
                ma_thue_i: item.ct46_ma_thue_i,
                ngay_ct: item.ct46_ngay_ct,
            })),
            hopDongThue: ct46gt.map(item => ({
                so_seri0: item.so_seri0,
                so_ct0: item.so_ct0,
                ma_kh: item.ma_kh,
                ten_kh: item.ten_kh,
                dia_chi: item.dia_chi,
                ma_so_thue: item.ma_so_thue,
                ten_vt: item.ten_vt,
                t_tien: item.t_tien,
                thue_suat: item.thue_suat,
                t_thue: item.t_thue,
                t_tt: item.t_tt,
                tk_thue_no: item.tk_thue_no,
                ma_thue: item.ma_thue,
                ma_ms: item.ma_ms,
                kh_mau_hd: item.kh_mau_hd,
                ngay_ct: item.ngay_ct
            }))
        };
    }

    async findAllPh46({ page, limit, search }: { page: number; limit: number; search?: string }) {
        const skip = (page - 1) * limit;

        const queryBuilder = this.ph46Repo.createQueryBuilder('ph46');

        if (search) {
            queryBuilder.where('ph46.ma_ct LIKE :search OR ph46.stt_rec LIKE :search OR ph46.dien_giai LIKE :search', {
                search: `%${search}%`,
            });
        }

        const [items, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('ph46.ngay_ct', 'DESC')
            .getManyAndCount();

        return {
            total,
            page,
            limit,
            items,
        };
    }

    async findAllCt46(stt_rec_input: string | string[]) {
        const stt_rec_list = Array.isArray(stt_rec_input)
            ? stt_rec_input.map((x) => x.trim())
            : stt_rec_input.split(',').map((x) => x.trim());

        const rawData = await this.ct46Repo
            .createQueryBuilder('ct46')
            .where('RTRIM(ct46.stt_rec) IN (:...stt_rec_list)', { stt_rec_list })
            .getRawMany();

        const data = rawData.map((row) => ({
            stt_rec: row.ct46_stt_rec,
            ma_ct: row.ct46_ma_ct,
            so_ct: row.ct46_so_ct,
            so_ct0: row.ct46_so_ct0,
            tk_i: row.ct46_tk_i,
            tien: row.ct46_tien,
            thue_suat: row.ct46_thue_suat,
            thue: row.ct46_thue,
            tt: row.ct46_tt,
            dien_giaii: row.ct46_dien_giaii,
            tk_thue_i: row.ct46_tk_thue_i,
            loai_hd: row.ct46_loai_hd,
            ma_ms: row.ct46_ma_ms,
            kh_mau_hd: row.ct46_kh_mau_hd,
        }));

        return data;
    }
}