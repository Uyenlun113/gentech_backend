import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../category-customer/customer.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity';
import { Material } from '../material/material.entity';
import { CreateHoaDonXuatKhoDto, HachToanDto } from './dto/create-hoadonxuatkho.dto';
import { QueryHoaDonXuatKhoDto } from './dto/query-hoadonxuatkho.dto';
import { UpdateHoaDonXuatKhoDto } from './dto/update-hoadonxuatkho.dto';
import { Ct81 } from './entity/ct81.entity';
import { Ctgt20 } from './entity/ctgt20.entity';
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
        @InjectRepository(Ctgt20)
        private readonly ctgt20Repository: Repository<Ctgt20>,
    ) { }

    async create(createDto: CreateHoaDonXuatKhoDto): Promise<{ ct81: Ct81[]; ph81: Ph81; ct00: Ct00[] }> {
        const stt_rec = await this.generateUniqueSttRec();
        let ph81Saved: Ph81 | null = null;
        let ct81Saved: Ct81[] = [];
        let ct00Saved: Ct00[] = [];

        try {
            // await this.dataSource.query(
            //     `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
            //     ["BC1", createDto.so_ct, stt_rec]
            // );
            let totalT_Tien = 0
            let totalSoLuong = 0
            // Tạo bản ghi PH81
            try {
                // Tạo bản ghi CT81
                if (Array.isArray(createDto.hachToanList) && createDto.hachToanList.length > 0) {
                    for (let i = 0; i < createDto.hachToanList.length; i++) {
                        const item: HachToanDto = createDto.hachToanList[i];
                        const ct81 = this.HoaDonXuatKhoRepository.create({
                            stt_rec,
                            stt_rec0: (i + 1).toString().padStart(3, '0'),
                            ma_vt: item.ma_vt,
                            ma_kho_i: item.ma_kho_i,
                            so_luong: item.so_luong,
                            gia2: item.gia2,
                            tien2: item.tien2,
                            gia: item.gia,
                            tien: item.tien,
                            tk_dt: item.tk_dt,
                            tk_vt: item.tk_vt,
                            tk_gv: item.tk_gv,
                            ma_ct: "HDA",
                        });
                        totalT_Tien += item.tien ?? 0;
                        totalSoLuong += item.so_luong
                        await this.HoaDonXuatKhoRepository.insert(ct81);
                        ct81Saved.push(ct81);
                    }
                }
            } catch (error) {
                throw new Error('Create ct81 failed: ' + error.message);
            }
            let totalT_Thue = totalT_Tien * Number(createDto.thue_suat)
            const ph81 = this.ph81Repository.create({
                stt_rec: stt_rec,
                ma_ct: "HDA",
                ma_gd: createDto.ma_gd,
                ma_kh: createDto.ma_kh,
                ten_kh: "",
                dia_chi: createDto.dia_chi,
                ma_so_thue: createDto.ma_so_thue,
                ong_ba: createDto.ong_ba, // Nếu cần lấy từ bảng Customer thì truy vấn thêm
                dien_giai: createDto.dien_giai,
                ma_nx: createDto.ma_nx,
                ma_bp: createDto.ma_bp,
                ngay_ct: createDto.ngay_ct,
                ngay_lct: createDto.ngay_lct,
                ma_qs: createDto.ma_qs,
                so_seri: createDto.so_seri,
                so_ct: createDto.so_ct,
                ma_nt: createDto.ma_nt,
                ty_gia: createDto.ty_gia,
                sl_in: createDto.sl_in,
                ma_thue: createDto.ma_thue,
                thue_suat: createDto.thue_suat,
                tk_thue_no: createDto.tk_no,
                tk_thue_co: createDto.tk_co,
                t_so_luong: totalSoLuong, // Nếu cần tổng số lượng thì tính từ hachToanList
                ten_vtthue: createDto.ten_vtthue,
                gc_thue: createDto.gc_thue,
                ht_tt: createDto.ht_tt,
                t_tien: totalT_Tien,
                t_thue: totalT_Thue,
                t_tt: totalT_Tien + totalT_Thue,//t_tien+t_thue
                sua_tien: createDto.sua_tien,
                px_gia_dd: createDto.px_gia_dd,

            });
            await this.ph81Repository.save(ph81);
            ph81Saved = ph81;

        } catch (error) {
            throw new Error('Create ph81 failed: ' + error.message);
        }


        // Nếu cần tạo ct00 thì bổ sung logic tương tự
        await this.dataSource.query(
            `EXEC [dbo].[SOCTHDA-Post] @stt_rec = '${stt_rec}' ,@IsHasPT1 = 0`
        );
        return { ct81: ct81Saved, ph81: ph81Saved, ct00: ct00Saved };
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
                        tk_no: ph.tk_thue_no,
                        tk_co: ph.tk_thue_co,
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

    async update(stt_rec: string, updateDto: UpdateHoaDonXuatKhoDto): Promise<{ ct81: Ct81[]; ph81: Ph81 | null; ct00: Ct00[] }> {
        let ph81Saved: Ph81 | null = null;
        let ct81Saved: Ct81[] = [];
        let ct00Saved: Ct00[] = [];
        try {
            // Xoá dữ liệu cũ
            await this.ct00Repository.delete({ stt_rec });
            await this.HoaDonXuatKhoRepository.delete({ stt_rec });

            // Cập nhật PH81
            await this.ph81Repository.update({ stt_rec }, {
                ma_ct: "HDA",
                ma_gd: updateDto.ma_gd,
                ma_kh: updateDto.ma_kh,
                dia_chi: updateDto.dia_chi,
                ma_so_thue: updateDto.ma_so_thue,
                ong_ba: updateDto.ong_ba,
                dien_giai: updateDto.dien_giai,
                ma_nx: updateDto.ma_nx,
                ma_bp: updateDto.ma_bp,
                ngay_ct: updateDto.ngay_ct,
                ngay_lct: updateDto.ngay_lct,
                ma_qs: updateDto.ma_qs,
                so_seri: updateDto.so_seri,
                so_ct: updateDto.so_ct,
                ma_nt: updateDto.ma_nt,
                ty_gia: updateDto.ty_gia,
                sl_in: updateDto.sl_in,
                ma_thue: updateDto.ma_thue,
                thue_suat: updateDto.thue_suat,
                tk_thue_no: updateDto.tk_no,
                tk_thue_co: updateDto.tk_co,
                ten_vtthue: updateDto.ten_vtthue,
                gc_thue: updateDto.gc_thue,
                ht_tt: updateDto.ht_tt,
                sua_tien: updateDto.sua_tien,
                px_gia_dd: updateDto.px_gia_dd
            });
            ph81Saved = await this.ph81Repository.findOneBy({ stt_rec });
        } catch (error) {
            throw new Error('Update PH81 failed: ' + error.message);
        }

        try {
            // CT81
            if (Array.isArray(updateDto.hachToanList)) {
                for (let i = 0; i < updateDto.hachToanList.length; i++) {
                    const item = updateDto.hachToanList[i];
                    const ct81 = this.HoaDonXuatKhoRepository.create({
                        ma_ct: "HDA",
                        stt_rec,
                        stt_rec0: (i + 1).toString().padStart(3, '0'),
                        ma_vt: item.ma_vt,
                        ma_kho_i: item.ma_kho_i,
                        so_luong: item.so_luong,
                        gia2: item.gia2,
                        tien2: item.tien2,
                        gia: item.gia_nt,
                        tien: item.tien,
                        tk_dt: item.tk_dt,
                        tk_vt: item.tk_vt,
                        tk_gv: item.tk_gv,
                        gia_nt: item.gia_nt,
                        gia_nt2: item.gia2
                    });
                    await this.HoaDonXuatKhoRepository.insert(ct81);
                    ct81Saved.push(ct81);
                }
            }
        } catch (error) {
            throw new Error('Update CT81 failed: ' + error.message);
        }

        // Nếu cần cập nhật ct00 thì bổ sung logic tương tự
        await this.dataSource.query(
            `EXEC [dbo].[SOCTHDA-Post] @stt_rec = '${stt_rec}' ,@IsHasPT1 = 0`
        );
        return {
            ct81: ct81Saved,
            ph81: ph81Saved,
            ct00: ct00Saved,
        };
    }

    async remove(stt_rec: string): Promise<void> {
        try {
            await this.ct00Repository.delete({ stt_rec });
            await this.HoaDonXuatKhoRepository.delete({ stt_rec });
            await this.ph81Repository.delete({ stt_rec });
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