import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ct31 } from './entity/ct31.entity';
import { Ph31 } from './entity/ph31.entity';
import { Ct31gt } from './entity/ct31gt.entity';
import { Customer } from '../category-customer/customer.entity'
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity';
import { CreateHoaDonMuaDVDto } from './dto/create-hoadonmuadv.dto';
import { UpdateHoaDonMuaDVDto } from './dto/update-hoadonmuadv.dto';
import { QueryHoaDonMuaDVDto } from './dto/query-hoadonmuadv.dto';

@Injectable()
export class HoaDonMuaDVService {
    constructor(
        @InjectRepository(Ct31)
        private readonly HoaDonMuaDVRepository: Repository<Ct31>,
        @InjectRepository(Ph31)
        private readonly ph31Repository: Repository<Ph31>,
        @InjectRepository(Ct00)
        private readonly ct00Repository: Repository<Ct00>,
        @InjectRepository(Ct31gt)
        private readonly ct31gtRepository: Repository<Ct31gt>,
        @InjectRepository(Customer)
        private readonly CustomerRepository: Repository<Customer>,
        private readonly dataSource: DataSource
    ) { }

    /**
     * Tạo mới bản ghi ở ph31, ct31, ct00 theo dữ liệu từ DTO
     */
    async create(createDto: CreateHoaDonMuaDVDto): Promise<{ ct31: Ct31[]; ph31: Ph31; ct00: Ct00[], ct31gt: Ct31gt[] }> {
        const stt_rec = await this.generateUniqueSttRec();
        let ph31Saved: Ph31 | null = null;
        let ct31Saved: Ct31[] = [];
        let ct31gtSaved: Ct31gt[] = [];
        let ct00Saved: Ct00[] = [];

        try {
            await this.dataSource.query(
                `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
                ["BC1", createDto.so_ct, stt_rec]
            );

            const ph31 = this.ph31Repository.create({
                stt_rec: stt_rec,
                ma_kh: createDto.ma_kh ?? '2',
                dia_chi: createDto.dia_chi ?? '',
                ong_ba: createDto.ong_ba ?? '',
                dien_giai: createDto.dien_giai ?? '',
                ngay_ct: createDto.ngay_ct ?? new Date(),
                ngay_lct: createDto.ngay_lct ?? new Date(),
                ngay_ct0: createDto.ngay_ct ?? new Date(),

                ma_ct: '',
                ma_dvcs: '',
                ma_qs: createDto.ma_qs ?? '',
                so_ct: createDto.so_ct ?? '',
                so_ct0: '',
                so_seri0: '',

                ma_nt: createDto.ma_nt ?? 'VND',
                ty_gia: createDto.ty_gia ?? 1,

                t_thue: 0,
                t_thue_nt: 0,
                t_tien: 0,
                t_tien_nt: 0,

                ma_nx: createDto.ma_nx ?? '',
                date: new Date(),
                date0: new Date(),
                t_tt:
                    0,
                t_tt_nt:
                    0,
                time:
                    "",
                ty_giaf:
                    0,
            });

            await this.ph31Repository.insert(ph31);
            ph31Saved = ph31;
        } catch (error) {
            throw new Error('Create ph31 failed: ' + error.message);
        }
        try {
            if (Array.isArray(createDto.hachToanList) && createDto.hachToanList.length > 0) {
                for (let i = 0; i < createDto.hachToanList.length; i++) {
                    const item = createDto.hachToanList[i];
                    const ct31 = this.HoaDonMuaDVRepository.create({
                        stt_rec,
                        stt_rec0: (i + 1).toString().padStart(3, '0'),
                        ma_ct: 'PN1',
                        ngay_ct: createDto.ngay_ct,
                        so_ct: createDto.so_ct ?? '',
                        tk_vt: item.tk_vt ?? '', // kiểu Number
                        dien_giaii: item.dien_giaii ?? '',
                        tien: item.tien ?? 0,
                    });
                    await this.HoaDonMuaDVRepository.insert(ct31);
                    ct31Saved.push(ct31);
                }
            }
        } catch (error) {
            throw new Error('Create ct31 failed: ' + error.message);
        }
        try {
            const validGT = Array.isArray(createDto.hopDongThue)
                ? createDto.hopDongThue.filter(gt =>
                    Object.values(gt).some(val => val !== null && val !== '')
                )
                : [];

            for (let i = 0; i < validGT.length; i++) {
                const gt = validGT[i];
                const ct31gt = this.ct31gtRepository.create({
                    stt_rec,
                    stt_rec0: (i + 1).toString().padStart(3, '0'),
                    ma_ms: gt.ma_ms,
                    ma_ct: 'PN1',
                    so_ct: createDto.so_ct,
                    ma_kh: gt.ma_kh,
                    ten_kh: gt.ten_kh,
                    dia_chi: gt.dia_chi,
                    ma_so_thue: gt.ma_so_thue,
                    kh_mau_hd: gt.kh_mau_hd,
                    ma_thue: gt.ma_thue,
                    ngay_ct: gt.ngay_ct,
                    so_ct0: gt.so_ct0?.trim() || '',
                    so_seri0: gt.so_seri0?.trim() || '',
                    ma_nt: createDto.ma_nt,
                    ty_gia: createDto.ty_gia ?? 1,
                    ten_vt: gt.ten_vt?.trim() || '',
                    t_tien_nt: gt.t_tien ?? 0,
                    t_tien: gt.t_tien ?? 0,
                    thue_suat: gt.thue_suat ?? 0,
                    t_thue_nt: gt.t_thue ?? 0,
                    t_thue: gt.t_thue ?? 0,
                    tk_thue_no: gt.tk_thue_no?.trim() || '',
                    ghi_chu: gt.ghi_chu?.trim() || '',
                    date: new Date(),
                    time: '',
                    date0: new Date(),
                    time0: '',
                    // status: '2',
                    ty_giaf: createDto.ty_gia ?? "1",
                });
                await this.ct31gtRepository.insert(ct31gt);
                ct31gtSaved.push(ct31gt);
            }
        } catch (error) {
            if (ph31Saved) await this.ph31Repository.delete({ stt_rec });
            throw new Error('Create ct31gt failed: ' + error.message);
        }

        try {
            ct00Saved = [];
            if (Array.isArray(createDto.hachToanList) && createDto.hachToanList.length > 0) {
                for (let i = 0; i < createDto.hachToanList.length; i++) {
                    const item = createDto.hachToanList[i];
                    const records = [
                        { ps_co: item.tien ?? 0, ps_no: 0, stt_rec0: ((i * 2) + 1).toString().padStart(3, '0') },
                        { ps_co: 0, ps_no: item.tien ?? 0, stt_rec0: ((i * 2) + 2).toString().padStart(3, '0') }
                    ];
                    for (const rec of records) {
                        const ct00 = this.ct00Repository.create({
                            stt_rec,
                            stt_rec0: rec.stt_rec0,
                            ma_ct: 'PN1',
                            ngay_ct: createDto.ngay_ct,
                            ngay_lct: createDto.ngay_lct,
                            so_ct: createDto.so_ct ?? '',
                            ong_ba: createDto.ong_ba ?? '',
                            dien_giai: item.dien_giaii ?? '',
                            ma_nt: createDto.ma_nt ?? '',
                            ty_gia: createDto.ty_gia ?? 1,
                            ma_kh: createDto.ma_kh ?? '',
                            ma_qs: createDto.ma_qs ?? '',
                            nh_dk: "A01",
                            ps_no_nt: 0,
                            ps_co_nt: 0,
                            ty_gia_ht: 1,
                            ty_gia_ht2: 1,
                            ps_co: rec.ps_co,
                            ps_no: rec.ps_no,
                            ct_nxt: 0,
                            ma_vv: "",
                            // status: '2',
                            ma_dvcs: 'CTY',
                            so_seri0: "",
                            loai_ct: '2',
                            dien_giai0: createDto.dien_giai ?? '',
                            nh_dkc: 'A01',
                        });
                        await this.ct00Repository.save(ct00);
                        ct00Saved.push(ct00);
                    }
                }
            }
        } catch (error) {
            if (ct31Saved.length > 0) await this.ct31gtRepository.delete({ stt_rec });
            if (ph31Saved) await this.ph31Repository.delete({ stt_rec });
            throw new Error('Create ct00 failed: ' + error.message);
        }

        // await this.dataSource.query(
        //     `EXEC [dbo].[APCTPN1-Post] @stt_rec = '${stt_rec}'`
        // );

        return { ct31: ct31Saved, ct31gt: ct31gtSaved, ph31: ph31Saved, ct00: ct00Saved };
    }


    async findAll(query: QueryHoaDonMuaDVDto): Promise<{
        data: CreateHoaDonMuaDVDto[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
    }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;

        try {
            const [ph31Records, total] = await this.ph31Repository.createQueryBuilder('ph31')
                .orderBy('ph31.stt_rec', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            const data: CreateHoaDonMuaDVDto[] = await Promise.all(
                ph31Records.map(async (ph) => {
                    const ct31 = await this.HoaDonMuaDVRepository.find({ where: { stt_rec: ph.stt_rec } });
                    const ct31gt = await this.ct31gtRepository.find({ where: { stt_rec: ph.stt_rec } });
                    const customer = await this.CustomerRepository.findOne({ where: { ma_kh: ph.ma_kh } });
                    // Map ct31 -> hachToanList
                    const hachToanList = ct31.map((item) => ({
                        tk_vt: item.tk_vt,
                        tien: item.tien,
                        dien_giaii: item.dien_giaii,
                        ten_tai_khoan: customer?.ten_kh,
                    }));

                    // Map ct31gt -> hopDongThue
                    const hopDongThue = ct31gt.map((item) => ({
                        ma_ms: item.ma_ms,
                        so_ct0: item.so_ct0,
                        so_seri0: item.so_seri0,
                        ngay_ct: item.ngay_ct,
                        thue_suat: item.thue_suat,
                        t_tien: item.t_tien,
                        t_thue: item.t_thue,
                        tk_thue_no: item.tk_thue_no,
                        ghi_chu: item.ghi_chu,
                        ten_vt: item.ten_vt,
                        kh_mau_hd: item.kh_mau_hd,
                        ma_kh: item.ma_kh,
                        ten_kh: item.ten_kh,
                        dia_chi: item.dia_chi,
                        ma_so_thue: item.ma_so_thue,
                        ma_thue: item.ma_thue,

                    }));

                    // Trả về theo CreateHoaDonMuaDVDto
                    return {
                        stt_rec: ph.stt_rec,
                        ma_kh: ph.ma_kh ?? "",
                        ten_kh: customer?.ten_kh,
                        mst: customer?.ma_so_thue,
                        dia_chi: ph.dia_chi,
                        ong_ba: ph.ong_ba,
                        dien_giai: ph.dien_giai,
                        ngay_ct: ph.ngay_ct,
                        ngay_lct: ph.ngay_lct,
                        ma_qs: ph.ma_qs,
                        so_ct: ph.so_ct,
                        ma_nt: ph.ma_nt,
                        ty_gia: ph.ty_gia,
                        // status: ph.status ?? "",
                        ma_nx: ph.ma_nx,
                        // tk_thue_no: ph.tk_thue_no,
                        t_tien: ph.t_tien,
                        t_thue: ph.t_thue,
                        t_tt: ph.t_tt,
                        date: ph.date,
                        time: ph.time,
                        hachToanList,
                        hopDongThue,
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
            throw new Error('FindAll HoaDonMuaDV failed: ' + error.message);
        }
    }


    async findOne(stt_rec: string): Promise<{
        ct31: Ct31gt[];
        ph31: Ph31 | null;
        ct00: Ct00[];
    }> {
        try {
            const ph31 = await this.ph31Repository.findOne({ where: { stt_rec } });
            const ct31 = await this.ct31gtRepository.find({ where: { stt_rec } });
            const ct00 = await this.ct00Repository.find({ where: { stt_rec } });
            return { ct31, ph31, ct00 };
        } catch (error) {
            throw new Error('FindOne HoaDonMuaDV failed: ' + error.message);
        }
    }

    /**
     * Cập nhật đồng thời ct31, ph31, ct00 theo dữ liệu từ DTO
     */
    async update(stt_rec: string, updateDto: UpdateHoaDonMuaDVDto): Promise<{ ct31: Ct31[]; ph31: Ph31; ct00: Ct00[]; ct31gt: Ct31gt[] }> {
        let ph31Saved: Ph31 | null = null;
        let ct31Saved: Ct31[] = [];
        let ct31gtSaved: Ct31gt[] = [];
        let ct00Saved: Ct00[] = [];
        //ph31
        try {
            // Xoá dữ liệu cũ
            await this.ct31gtRepository.delete({ stt_rec });
            await this.ct00Repository.delete({ stt_rec });
            await this.HoaDonMuaDVRepository.delete({ stt_rec });

            // Cập nhật PH31
            await this.ph31Repository.update({ stt_rec }, {
                ma_kh: updateDto.ma_kh ?? '2',
                dia_chi: updateDto.dia_chi ?? '',
                ong_ba: updateDto.ong_ba ?? '',
                dien_giai: updateDto.dien_giai ?? '',
                ngay_ct: updateDto.ngay_ct ?? '',
                ngay_lct: updateDto.ngay_lct ?? '',
                ma_qs: updateDto.ma_qs ?? '',
                so_ct: updateDto.so_ct ?? '',
                ma_nt: updateDto.ma_nt ?? '',
                ty_gia: updateDto.ty_gia ?? 1,
                ma_nx: updateDto.ma_nx,
                date: new Date(),
                date0: new Date(),
            });

        } catch (error) {
            throw new Error('Update PH31 failed: ' + error.message);
        }
        //ct31
        try {
            // CT31
            if (Array.isArray(updateDto.hachToanList)) {
                for (let i = 0; i < updateDto.hachToanList.length; i++) {
                    const item = updateDto.hachToanList[i];
                    const ct31 = this.HoaDonMuaDVRepository.create({
                        stt_rec,
                        stt_rec0: (i + 1).toString().padStart(3, '0'),
                        ma_ct: 'PN1',
                        ngay_ct: updateDto.ngay_ct,
                        so_ct: updateDto.so_ct ?? '',
                        tk_vt: item.tk_vt ?? '',
                        dien_giaii: item.dien_giaii ?? '',
                        tien: item.tien ?? 0,
                    });
                    await this.HoaDonMuaDVRepository.insert(ct31);
                    ct31Saved.push(ct31);
                }
            }
        } catch (error) {
            throw new Error('Update CT31 failed: ' + error.message);
        }
        //ct31gt
        try {
            const validGT = Array.isArray(updateDto.hopDongThue)
                ? updateDto.hopDongThue.filter(gt =>
                    Object.values(gt).some(val => val !== null && val !== '')
                )
                : [];

            for (let i = 0; i < validGT.length; i++) {
                const gt = validGT[i];
                const ct31gt = this.ct31gtRepository.create({
                    stt_rec,
                    stt_rec0: (i + 1).toString().padStart(3, '0'),
                    ma_ct: 'PN1',
                    so_ct: updateDto.so_ct,
                    ma_ms: gt.ma_ms,
                    ma_kh: gt.ma_kh,
                    ten_kh: gt.ten_kh,
                    dia_chi: gt.dia_chi,
                    ma_so_thue: gt.ma_so_thue,
                    kh_mau_hd: gt.kh_mau_hd,
                    ma_thue: gt.ma_thue,
                    ngay_ct: gt.ngay_ct,
                    so_ct0: gt.so_ct0?.trim() || '',
                    so_seri0: gt.so_seri0?.trim() || '',
                    ma_nt: updateDto.ma_nt,
                    ty_gia: updateDto.ty_gia ?? 1,
                    ten_vt: gt.ten_vt?.trim() || '',
                    t_tien_nt: gt.t_tien ?? 0,
                    t_tien: gt.t_tien ?? 0,
                    thue_suat: gt.thue_suat ?? 0,
                    t_thue_nt: gt.t_thue ?? 0,
                    t_thue: gt.t_thue ?? 0,
                    tk_thue_no: gt.tk_thue_no?.trim() || '',
                    ghi_chu: gt.ghi_chu?.trim() || '',
                    date: new Date(),
                    time: '',
                    date0: new Date(),
                    time0: '',
                    // status: '2',
                    ty_giaf: updateDto.ty_gia ?? 1,
                });
                await this.ct31gtRepository.insert(ct31gt);
                ct31gtSaved.push(ct31gt);
            }
        } catch (error) {
            throw new Error('Update CT31GT failed: ' + error.message);
        }
        //ct00
        try {
            ct00Saved = [];
            if (Array.isArray(updateDto.hachToanList)) {
                for (let i = 0; i < updateDto.hachToanList.length; i++) {
                    const item = updateDto.hachToanList[i];
                    const records = [
                        { ps_co: item.tien ?? 0, ps_no: 0, stt_rec0: ((i * 2) + 1).toString().padStart(3, '0') },
                        { ps_co: 0, ps_no: item.tien ?? 0, stt_rec0: ((i * 2) + 2).toString().padStart(3, '0') }
                    ];
                    for (const rec of records) {
                        const ct00 = this.ct00Repository.create({
                            stt_rec,
                            stt_rec0: rec.stt_rec0,
                            ma_ct: 'PN1',
                            // ngay_ct: updateDto.ngay_ct,
                            // ngay_lct: updateDto.ngay_lct,
                            // so_ct: updateDto.so_ct ?? '',
                            // ong_ba: updateDto.ong_ba ?? '',
                            // dien_giai: item.dien_giaii ?? '',
                            // ma_nt: updateDto.ma_nt ?? '',
                            // ty_gia: updateDto.ty_gia ?? 1,
                            // ma_kh: updateDto.ma_kh ?? '',
                            // ma_qs: updateDto.ma_qs ?? '',
                            // nh_dk: "A01",
                            // ps_no_nt: 0,
                            // ps_co_nt: 0,
                            // ty_gia_ht: 1,
                            // ty_gia_ht2: 1,
                            // ps_co: rec.ps_co,
                            // ps_no: rec.ps_no,
                            // ct_nxt: 0,
                            // ma_vv: "",
                            // // status: '2',
                            // ma_dvcs: 'CTY',
                            // so_seri0: "",
                            // loai_ct: '2',
                            // dien_giai0: updateDto.dien_giai ?? '',
                            // nh_dkc: 'A01',
                            ma_gd: '',
                            ngay_ct: updateDto.ngay_ct ?? new Date(),
                            ngay_lct: updateDto.ngay_lct,
                            so_ct: updateDto.so_ct ?? '',
                            ong_ba: updateDto.ong_ba ?? '',
                            dien_giai: item.dien_giaii ?? '',
                            ma_nt: updateDto.ma_nt ?? '',
                            ty_gia: updateDto.ty_gia ?? 1,
                            ma_kh: updateDto.ma_kh ?? '',
                            ma_qs: updateDto.ma_qs ?? '',
                            nh_dk: "A01",
                            tk: String(item.tk_vt ?? ''),
                            tk_du: '',
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
                            dien_giai0: updateDto.dien_giai ?? '',
                            nh_dkc: 'A01',
                        });
                        let data = await this.ct00Repository.save(ct00);
                        ct00Saved.push(ct00);
                    }
                }
            }
        } catch (error) {
            throw new Error('Update CT00 failed: ' + error.message);
        }

        // Gọi lại thủ tục post nếu cần
        // await this.dataSource.query(
        //     `EXEC [dbo].[APCTPN1-Post] @stt_rec = '${stt_rec}'`
        // );

        const ph31Updated = await this.ph31Repository.findOneBy({ stt_rec });

        if (!ph31Updated) {
            throw new Error(`Không tìm thấy PH31 với stt_rec = ${stt_rec}`);
        }

        return {
            ct31: ct31Saved,
            ct31gt: ct31gtSaved,
            ph31: ph31Updated,
            ct00: ct00Saved,
        };
    }


    async remove(stt_rec: string): Promise<void> {
        try {
            // Xóa ct00 trước
            await this.ct00Repository.delete({ stt_rec });

            // Xóa ct31gt (hợp đồng thuế)
            await this.ct31gtRepository.delete({ stt_rec });

            // Xóa ct31 (chi tiết hóa đơn)
            await this.HoaDonMuaDVRepository.delete({ stt_rec });

            // Xóa ph31 (phiếu hóa đơn)
            await this.ph31Repository.delete({ stt_rec });
        } catch (error) {
            throw new Error('Remove HoaDonMuaDV failed: ' + error.message);
        }
    }

    /**
     * Sinh mã stt_rec mới, đảm bảo không trùng trong bảng ph31
     */
    async generateUniqueSttRec(prefix = 'APN1'): Promise<string> {
        try {
            const last = await this.ph31Repository.createQueryBuilder('ph31')
                .where("ph31.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
                .orderBy('ph31.stt_rec', 'DESC')
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
                const found = await this.ph31Repository.findOneBy({ stt_rec });
                isExist = !!found;
                if (isExist) nextNumber++;
            } while (isExist);
            return stt_rec;
        } catch (error) {
            throw new Error('Generate stt_rec failed: ' + error.message);
        }
    }
}
