import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../category-customer/customer.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity';
import { Material } from '../material/material.entity';
import { CreateHoaDonXuatKhoDto, fullDto } from './dto/create-hoadonxuatkho.dto';
import { QueryHoaDonXuatKhoDto } from './dto/query-hoadonxuatkho.dto';
import { Ct70 } from './entity/ct70.entity';
import { Ct81 } from './entity/ct81.entity';
import { Ph81 } from './entity/ph81.entity';

@Injectable()
export class HoaDonXuatKhoService {
    constructor(
        @InjectRepository(Ct81)
        private readonly HoaDonXuatKhoRepository: Repository<Ct81>,
        @InjectRepository(Ph81)
        private readonly ph81Repository: Repository<Ph81>,
        @InjectRepository(Ct00)
        private readonly ct00Repository: Repository<Ct00>,
        private readonly dataSource: DataSource,
        @InjectRepository(Customer)
        private readonly CustomerRepository: Repository<Customer>,
        @InjectRepository(Material)
        private readonly MaterialRepository: Repository<Material>,
        @InjectRepository(Ct70)
        private readonly ct70Repository: Repository<Ct70>,
    ) { }

    async create(createDto: fullDto) {
        const { phieu, hangHoa } = createDto;
        const ma_ct = 'HDA';
        const ma_dvcs = 'CTY';
        const stt_rec = await this.generateUniqueSttRec();

        // 1. Check số chứng từ hợp lệ
        await this.dataSource.query(
            `EXEC [dbo].[CheckValidSoCt#3] @ma_qs = @0, @so_ct = @1`,
            [phieu.ma_qs, phieu.so_ct]
        );

        // 2. Transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Tổng tiền và tổng số lượng
            let totalT_Tien = 0;
            let totalSoLuong = 0;
            hangHoa.forEach(item => {
                totalT_Tien += item.tien ?? 0;
                totalSoLuong += item.so_luong ?? 0;
            });
            const totalT_Thue = totalT_Tien * Number(phieu.thue_suat ?? 0);

            // 3. Lưu PH81
            await queryRunner.manager.save(this.ph81Repository.create({
                ...phieu,
                stt_rec,
                ma_ct,
                ma_dvcs,
                ty_gia: 1,
                t_so_luong: totalSoLuong,
                t_tien: totalT_Tien,
                t_thue: totalT_Thue,
                t_tt: totalT_Tien + totalT_Thue,
                t_tien_nt2: totalT_Tien,
                t_tien2: totalT_Tien,
                t_tt_nt: totalT_Tien + totalT_Thue,
                tk_thue_no: phieu.ma_nx
            }));

            // 4. Lưu CT81
            const chiTietEntities = hangHoa.map((item, index) =>
                this.HoaDonXuatKhoRepository.create({
                    ...item,
                    stt_rec,
                    ma_ct,
                    so_ct: phieu.so_ct,
                    ngay_ct: phieu.ngay_ct,
                })
            );
            await queryRunner.manager.save(chiTietEntities);

            // 5. Commit transaction
            await queryRunner.commitTransaction();

        } catch (err) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw err;
        } finally {
            await queryRunner.release();
        }

        // 6. Gọi các stored procedure check và post
        await this.dataSource.query(
            `EXEC [dbo].[SOCTHDA-CheckData] @status = @0, @mode = @1, @stt_rec = @2`,
            ['2', 0, stt_rec]
        );

        await this.dataSource.query(
            `EXEC [dbo].[SOCTHDA-Post] @stt_rec = @0, @Ap_gia = @1, @IsHasPT1 = @2`,
            [stt_rec, 0, 0]
        );

        return { success: true, message: 'Tạo phiếu HDA thành công', stt_rec };
    }
    async findAll(query: QueryHoaDonXuatKhoDto): Promise<{
        data: CreateHoaDonXuatKhoDto[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
    }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;

        try {
            const [ph81Records, total] = await this.ph81Repository.createQueryBuilder('ph81')
                .orderBy('ph81.stt_rec', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            const data: CreateHoaDonXuatKhoDto[] = await Promise.all(
                ph81Records.map(async (ph) => {
                    const ct81 = await this.HoaDonXuatKhoRepository.find({ where: { stt_rec: ph.stt_rec } });
                    const customer = await this.CustomerRepository.findOne({ where: { ma_kh: ph.ma_kh } });

                    // Map ct81 -> hachToanList
                    const hachToanList = await Promise.all(
                        ct81.map(async (item) => {
                            const dmvt = await this.MaterialRepository.findOne({
                                where: { ma_vt: item.ma_vt },
                            });

                            return {
                                ma_vt: item.ma_vt,
                                ten_vt: dmvt?.ten_vt,
                                dvt: dmvt?.dvt,
                                ma_kho_i: item.ma_kho_i,
                                so_luong: item.so_luong,
                                gia2: item.gia2,
                                tien2: item.tien2 ?? 0, // xử lý undefined
                                gia: item.gia,
                                tien: item.tien,
                                tk_dt: item.tk_dt,
                                tk_vt: item.tk_vt ?? '', // fallback từ dmvt
                                tk_gv: item.tk_gv,
                            };
                        })
                    );


                    return {
                        stt_rec: ph.stt_rec,
                        ma_gd: ph.ma_gd,
                        ma_kh: ph.ma_kh,
                        ten_kh: customer?.ten_kh,
                        dia_chi: ph.dia_chi,
                        ma_so_thue: ph.ma_so_thue,
                        ong_ba: ph.ong_ba,
                        dien_giai: ph.dien_giai,
                        ma_nx: ph.ma_nx,
                        ma_bp: ph.ma_bp,
                        ngay_ct: ph.ngay_ct,
                        ngay_lct: ph.ngay_lct,
                        ma_qs: ph.ma_qs,
                        so_seri: ph.so_seri,
                        so_ct: ph.so_ct,
                        ma_nt: ph.ma_nt,
                        ty_gia: ph.ty_gia,
                        sl_in: ph.sl_in,
                        ma_thue: ph.ma_thue,
                        thue_suat: ph.thue_suat,
                        tk_thue_co: ph.tk_thue_co,
                        ten_vtthue: ph.ten_vtthue,
                        gc_thue: ph.gc_thue,
                        ht_tt: ph.ht_tt,
                        t_so_luong: ph.t_so_luong,
                        hachToanList,
                        t_tien: ph.t_tien,
                        t_thue: ph.t_thue,
                        t_tt: ph.t_tt,
                        sua_tien: ph.sua_tien,
                        px_gia_dd: ph.px_gia_dd
                    };
                })
            );

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
            throw new Error('FindAll HoaDonXuatKho failed: ' + error.message);
        }
    }

    async findOne(stt_rec: string): Promise<{
        ct81: Ct81[];
        ph81: Ph81 | null;
        ct00: Ct00[];
    }> {
        try {
            const ph81 = await this.ph81Repository.findOne({ where: { stt_rec } });
            const ct81 = await this.HoaDonXuatKhoRepository.find({ where: { stt_rec } });
            const ct00 = await this.ct00Repository.find({ where: { stt_rec } });
            return { ct81, ph81, ct00 };
        } catch (error) {
            throw new Error('FindOne HoaDonXuatKho failed: ' + error.message);
        }
    }

    async update(stt_rec: string, updateDto: fullDto) {
        const { phieu, hangHoa } = updateDto;
        const ma_ct = 'HDA';
        const ma_dvcs = 'CTY';

        // 1. Transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Xóa dữ liệu cũ (CT81 + CT00)
            await queryRunner.manager.delete(Ct00, { stt_rec });
            await queryRunner.manager.delete(Ct81, { stt_rec });

            // 2. Tính tổng tiền và số lượng
            let totalT_Tien = 0;
            let totalSoLuong = 0;
            hangHoa?.forEach(item => {
                totalT_Tien += item.tien ?? 0;
                totalSoLuong += item.so_luong ?? 0;
            });
            const totalT_Thue = totalT_Tien * Number(phieu.thue_suat ?? 0);

            // 3. Cập nhật PH81 (header)
            await queryRunner.manager.update(Ph81, { stt_rec }, {
                ...phieu,
                ma_ct,
                ma_dvcs,
                t_so_luong: totalSoLuong,
                t_tien: totalT_Tien,
                t_thue: totalT_Thue,
                t_tt: totalT_Tien + totalT_Thue,
                t_tien_nt2: totalT_Tien,
                t_tien2: totalT_Tien,
                t_tt_nt: totalT_Tien + totalT_Thue,
                tk_thue_no: phieu.ma_nx
            });

            const ph81Saved = await queryRunner.manager.findOne(Ph81, { where: { stt_rec } });

            // 4. Thêm lại CT81 (chi tiết)
            const chiTietEntities = hangHoa?.map((item, index) =>
                this.HoaDonXuatKhoRepository.create({
                    ...item,
                    stt_rec,
                    ma_ct,
                    so_ct: phieu.so_ct,
                    ngay_ct: phieu.ngay_ct,
                    stt_rec0: (index + 1).toString().padStart(3, '0')
                })
            ) || [];

            if (chiTietEntities.length > 0) {
                await queryRunner.manager.save(chiTietEntities);
            }

            // 5. Commit transaction
            await queryRunner.commitTransaction();

            // 6. Gọi các stored procedure
            await this.dataSource.query(
                `EXEC [dbo].[SOCTHDA-CheckData] @status = @0, @mode = @1, @stt_rec = @2`,
                ['2', 0, stt_rec]
            );

            const ct00Saved = await this.dataSource.query(
                `EXEC [dbo].[SOCTHDA-Post] @stt_rec = @0 , @Ap_gia = @1, @IsHasPT1 = @2`,
                [stt_rec, 0, 0]
            );

            return {
                ct81: chiTietEntities,
                ph81: ph81Saved,
                ct00: ct00Saved
            };

        } catch (err) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw err;
        } finally {
            await queryRunner.release();
        }
    }


    async remove(stt_rec: string): Promise<void> {
        try {
            await this.ct00Repository.delete({ stt_rec });
            await this.HoaDonXuatKhoRepository.delete({ stt_rec });
            await this.ph81Repository.delete({ stt_rec });
            await this.ct70Repository.delete({ stt_rec });
        } catch (error) {
            throw new Error('Remove HoaDonXuatKho failed: ' + error.message);
        }
    }
    // Các hàm findAll, findOne, update, remove viết tương tự, map đúng trường entity và DTO

    async generateUniqueSttRec(prefix = 'AHDA'): Promise<string> {
        try {
            const last = await this.ph81Repository.createQueryBuilder('ph81')
                .where("ph81.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
                .orderBy('ph81.stt_rec', 'DESC')
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
                stt_rec = `${prefix}${nextNumber.toString().padStart(7, '0')}`;
                const found = await this.ph81Repository.findOneBy({ stt_rec });
                isExist = !!found;
                if (isExist) nextNumber++;
            } while (isExist);
            return stt_rec;
        } catch (error) {
            throw new Error('Generate stt_rec failed: ' + error.message);
        }
    }
}