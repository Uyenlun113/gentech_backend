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
                        hd.so_seri0 || '',
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
        const { phieu, hachToan, hopDongThue } = dto;

        // Kiểm tra xem record có tồn tại không
        const existingPh11 = await this.ph11Repo.findOne({ where: { stt_rec } });
        if (!existingPh11) {
            throw new NotFoundException(`Không tìm thấy phiếu với STT_REC: ${stt_rec}`);
        }

        const ma_ct = phieu.so_ct;
        const ngay_ct = new Date(phieu.ngay_lct);

        // Cập nhật Ph11
        await this.ph11Repo.update({ stt_rec }, {
            ...phieu,
            ngay_ct,
        });

        // Xóa tất cả Ct11 cũ và tạo mới
        await this.ct11Repo.delete({ stt_rec });
        const validHachToan = (Array.isArray(hachToan) ? hachToan : []).filter(ht =>
            Object.values(ht).some(val => val !== null && val !== '')
        );
        if (validHachToan.length > 0) {
            await this.ct11Repo.save(
                validHachToan.map(ht => ({
                    ...ht,
                    stt_rec,
                    ngay_ct,
                }))
            );
        }

        // Xóa tất cả Ct11Gt cũ và tạo mới
        await this.ct11gtRepo.delete({ stt_rec });
        const validHopDongThue = (Array.isArray(hopDongThue) ? hopDongThue : []).filter(gt =>
            Object.values(gt).some(val => val !== null && val !== '')
        );
        if (validHopDongThue.length > 0) {
            await this.ct11gtRepo.save(
                validHopDongThue.map(gt => ({
                    ...gt,
                    stt_rec,
                }) as Ct11GtEntity)
            );
        }

        // Cập nhật Ct00
        await this.ct00Repo.update({ stt_rec }, {
            ma_ct,
            ma_kh: validHopDongThue[0]?.ma_kh?.trim() || null,
            ngay_ct,
        });

        return { message: 'Cập nhật thành công', stt_rec };
    }

    async delete(stt_rec: string) {
        // Kiểm tra xem record có tồn tại không
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

        const ct11 = await this.ct11Repo.find({ where: { stt_rec } });
        const ct11gt = await this.ct11gtRepo.find({ where: { stt_rec } });

        return {
            phieu: ph11,
            hachToan: ct11.map(item => ({
                tk_i: item.tk_i,
                ps_no: item.ps_no,
                ps_co: item.ps_co,
                nh_dk: item.nh_dk,
                dien_giaii: item.dien_giaii,
            })),
            hopDongThue: ct11gt.map(item => ({
                so_seri0: item.so_seri0,
                ma_kh: item.ma_kh,
                ten_kh: item.ten_kh,
            })),
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

    async findAllCt11(stt_rec: string) {
        const rawData = await this.ct11Repo
            .createQueryBuilder('ct11')
            .where('ct11.stt_rec = :stt_rec', { stt_rec })
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