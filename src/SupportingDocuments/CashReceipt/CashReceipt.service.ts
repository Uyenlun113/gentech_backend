import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ct41 } from './entity/ct41.entity';
import { Ph41 } from './entity/ph41.entity';
import { Ct00 } from './entity/ct00.entity';
import { CreateCashReceiptDto } from './dto/create-cash-receipt.dto';
import { UpdateCashReceiptDto } from './dto/update-cash-receipt.dto';
import { QueryCashReceiptDto } from './dto/query-cash-receipt.dto';

@Injectable()
export class CashReceiptService {
    constructor(
        @InjectRepository(Ct41)
        private readonly cashReceiptRepository: Repository<Ct41>,
        @InjectRepository(Ph41)
        private readonly ph41Repository: Repository<Ph41>,
        @InjectRepository(Ct00)
        private readonly ct00Repository: Repository<Ct00>,
    ) { }

    /**
     * Tạo mới bản ghi ở ct41, ph41, ct00 theo dữ liệu từ DTO
     */
    async create(createDto: CreateCashReceiptDto): Promise<{ ct41: Ct41; ph41: Ph41; ct00: Ct00 }> {
        // 1. Sinh mã stt_rec
        const stt_rec = await this.generateUniqueSttRec();
        let ct41Saved: Ct41 | null = null;
        let ph41Saved: Ph41 | null = null;
        let ct00Saved: Ct00 | null = null;
        try {
            // 2. Tạo ct41
            const ct41 = this.cashReceiptRepository.create({
                stt_rec: stt_rec,
                ma_ct: 'PT1',
                ngay_ct: createDto.ngay_ct,
                so_ct: createDto.so_ct ?? '',
                dien_giaii: createDto.dien_giai ?? '',
                tk_i: '111', // default
                tien_nt: 0, // default
                tien: 0, // default
                thue: 0, // default
                thue_nt: 0, // default
                tien_tt: 0, // default
                stt_rec0: '001',
                so_ct0: '',
                ty_giahtf2: 0,
            });
            ct41Saved = await this.cashReceiptRepository.save(ct41);
        } catch (error) {
            throw new Error('Create ct41 failed: ' + error.message);
        }

        try {
            // 3. Tạo ph41
            const ph41 = this.ph41Repository.create({
                stt_rec: stt_rec,
                ma_gd: createDto.ma_gd ?? '',
                ma_kh: createDto.ma_kh ?? '2',
                dia_chi: createDto.dia_chi ?? '',
                ong_ba: createDto.ong_ba ?? '',
                dien_giai: createDto.dien_giai ?? '',
                ngay_ct: createDto.ngay_ct ?? '',
                ngay_lct: createDto.ngay_lct ?? '',
                ma_qs: createDto.ma_qs ?? '',
                so_ct: createDto.so_ct ?? '',
                ma_nt: createDto.ma_nt ?? '',
                ty_gia: createDto.ty_gia ?? 1,
                // loai_ct: createDto.loai_ct ?? '',
                ma_dvcs: 'CTY',
                ma_ct: 'PT1',
                tk: '1111',
                t_thue_nt: 0,
                t_tien_nt: 0,
                t_thue: 0,
                t_tien: 0,
                t_tt_nt: 0,
                date: new Date(),
                time: "",
                user_id: "1",
                date0: new Date(),
                time0: "",
                user_id0: "1",
                status: '2',
                loai_ct: '2',
                han_tt: "0",
                ty_giaf: 1,
                hd_thue: "0",
                sysflag: 'P',
            });
            ph41Saved = await this.ph41Repository.save(ph41);
        } catch (error) {
            // Nếu lỗi khi tạo ph41 thì xóa ct41
            if (ct41Saved) await this.cashReceiptRepository.delete({ stt_rec });
            throw new Error('Create ph41 failed: ' + error.message);
        }

        try {
            // 4. Tạo ct00
            const ct00 = this.ct00Repository.create({
                stt_rec: stt_rec,
                stt_rec0: '001',
                ma_ct: 'PT1',
                ma_gd: createDto.ma_gd ?? '',
                ngay_ct: createDto.ngay_ct,
                ngay_lct: createDto.ngay_lct,
                so_ct: createDto.so_ct ?? '',
                ong_ba: createDto.ong_ba ?? '',
                dien_giai: createDto.dien_giai ?? '',
                ma_nt: createDto.ma_nt ?? '',
                ty_gia: createDto.ty_gia ?? 1,
                // loai_ct: createDto.loai_ct ?? '',
                ma_kh: createDto.ma_kh ?? '',
                ma_qs: createDto.ma_qs ?? '',
                nh_dk: "A01",
                tk: '1111',
                tk_du: '1111',
                ps_no_nt: 0,
                ps_co_nt: 0,
                ty_gia_ht: 1,
                ty_gia_ht2: 1,
                ps_co: 0,
                ps_no: 0,
                ct_nxt: 0,
                ma_vv: "",
                status: '2',
                ma_dvcs: 'CTY',
                so_seri0: "",
                loai_ct: '2',
                dien_giai0: createDto.dien_giai ?? '',
                nh_dkc: 'A01',
            });
            ct00Saved = await this.ct00Repository.save(ct00);
        } catch (error) {
            // Nếu lỗi khi tạo ct00 thì xóa ph41 và ct41
            if (ph41Saved) await this.ph41Repository.delete({ stt_rec });
            if (ct41Saved) await this.cashReceiptRepository.delete({ stt_rec });
            throw new Error('Create ct00 failed: ' + error.message);
        }

        return { ct41: ct41Saved, ph41: ph41Saved, ct00: ct00Saved };
    }

    async findAll(query: QueryCashReceiptDto): Promise<{
        data: Ph41[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
    }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        try {
            const queryBuilder = this.ph41Repository.createQueryBuilder('ph41');

            // Thêm search với các trường ong_ba, ma_gd, so_ct
            if (query.search) {
                const searchTerm = `%${query.search}%`;
                queryBuilder.andWhere(
                    '(ph41.ong_ba LIKE :search OR ph41.ma_gd LIKE :search OR ph41.so_ct LIKE :search)',
                    { search: searchTerm }
                );
            }

            const [data, total] = await queryBuilder
                .orderBy('ph41.ngay_ct', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new Error('FindAll CashReceipt failed: ' + error.message);
        }
    }
    async findOne(stt_rec: string): Promise<Ct41 | null> {
        try {
            return await this.cashReceiptRepository.findOneBy({ stt_rec });
        } catch (error) {
            throw new Error('FindOne CashReceipt failed: ' + error.message);
        }
    }

    /**
     * Cập nhật đồng thời ct41, ph41, ct00 theo dữ liệu từ DTO
     */
    async update(stt_rec: string, updateDto: UpdateCashReceiptDto): Promise<{ ct41: Ct41 | null; ph41: Ph41 | null; ct00: Ct00 | null }> {
        try {
            // 1. Update ct41
            await this.cashReceiptRepository.update({ stt_rec }, {
                ngay_ct: updateDto.ngay_ct,
                so_ct: updateDto.so_ct,
                dien_giaii: updateDto.dien_giai,
            });
            const ct41 = await this.cashReceiptRepository.findOneBy({ stt_rec });

            // 2. Update ph41
            const ph41Repo = this.cashReceiptRepository.manager.getRepository(Ph41);
            await ph41Repo.update({ stt_rec }, {
                ma_gd: updateDto.ma_gd,
                ma_kh: updateDto.ma_kh,
                dia_chi: updateDto.dia_chi,
                ong_ba: updateDto.ong_ba,
                dien_giai: updateDto.dien_giai,
                ngay_ct: updateDto.ngay_ct,
                ngay_lct: updateDto.ngay_lct,
                ma_qs: updateDto.ma_qs,
                so_ct: updateDto.so_ct,
                ma_nt: updateDto.ma_nt,
                ty_gia: updateDto.ty_gia,
                loai_ct: updateDto.loai_ct,
            });
            const ph41 = await ph41Repo.findOneBy({ stt_rec });

            // 3. Update ct00
            const ct00Repo = this.cashReceiptRepository.manager.getRepository(Ct00);
            await ct00Repo.update({ stt_rec }, {
                ma_gd: updateDto.ma_gd,
                ngay_ct: updateDto.ngay_ct,
                ngay_lct: updateDto.ngay_lct,
                so_ct: updateDto.so_ct,
                ong_ba: updateDto.ong_ba,
                dien_giai: updateDto.dien_giai,
                ma_nt: updateDto.ma_nt,
                ty_gia: updateDto.ty_gia,
                loai_ct: updateDto.loai_ct,
                ma_kh: updateDto.ma_kh,
                ma_qs: updateDto.ma_qs,
            });
            const ct00 = await ct00Repo.findOneBy({ stt_rec });

            return { ct41, ph41, ct00 };
        } catch (error) {
            throw new Error('Update CashReceipt failed: ' + error.message);
        }
    }

    async remove(stt_rec: string): Promise<void> {
        try {
            // Xóa ct00 trước (nếu có)
            await this.ct00Repository.delete({ stt_rec });
            // Xóa ph41
            await this.ph41Repository.delete({ stt_rec });
            // Xóa ct41 cuối cùng
            await this.cashReceiptRepository.delete({ stt_rec });
        } catch (error) {
            throw new Error('Remove CashReceipt failed: ' + error.message);
        }
    }

    /**
     * Sinh mã stt_rec mới, đảm bảo không trùng trong bảng ct41
     */
    async generateUniqueSttRec(prefix = 'APT'): Promise<string> {
        try {
            const last = await this.cashReceiptRepository.createQueryBuilder('ct41')
                .where("ct41.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
                .orderBy('ct41.stt_rec', 'DESC')
                .getOne();
            let nextNumber = 1;
            if (last && last.stt_rec && last.stt_rec.length > prefix.length) {
                const numPart = last.stt_rec.substring(prefix.length);
                const parsed = parseInt(numPart, 10);
                if (!isNaN(parsed)) nextNumber = parsed + 1;
            }
            let stt_rec: string;
            let isExist = true;
            do {
                stt_rec = `${prefix}${nextNumber.toString().padStart(8, '0')}`;
                const found = await this.cashReceiptRepository.findOneBy({ stt_rec });
                isExist = !!found;
                if (isExist) nextNumber++;
            } while (isExist);
            return stt_rec;
        } catch (error) {
            throw new Error('Generate stt_rec failed: ' + error.message);
        }
    }
}
