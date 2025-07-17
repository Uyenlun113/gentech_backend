import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ct56 } from './entity/ct56.entity';
import { Ph56 } from './entity/ph56.entity';
import { Ct56gt } from './entity/ct56gt.entity';
import { Ct00 } from './entity/ct00.entity';
import { CreateGiayBaoNoDto } from './dto/create-giaybaono.dto';
import { UpdateGiayBaoNoDto } from './dto/update-giaybaono.dto';
import { QueryGiayBaoNoDto } from './dto/query-giaybaono.dto';

@Injectable()
export class GiayBaoNoService {
    constructor(
        @InjectRepository(Ct56)
        private readonly GiayBaoNoRepository: Repository<Ct56>,
        @InjectRepository(Ph56)
        private readonly ph56Repository: Repository<Ph56>,
        @InjectRepository(Ct00)
        private readonly ct00Repository: Repository<Ct00>,
        @InjectRepository(Ct56gt)
        private readonly ct56gtRepository: Repository<Ct56gt>,
        private readonly dataSource: DataSource
    ) { }

    /**
     * Tạo mới bản ghi ở ph56, ct56, ct00 theo dữ liệu từ DTO
     */
    async create(createDto: CreateGiayBaoNoDto): Promise<{ ct56: Ct56[]; ph56: Ph56; ct00: Ct00[] }> {
        // 1. Sinh mã stt_rec
        const stt_rec = await this.generateUniqueSttRec();
        let ph56Saved: Ph56 | null = null;
        let ct56Saved: Ct56[] = [];
        let ct00Saved: Ct00[] = [];
        try {
            await this.dataSource.query(
                `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
                ["BC1", createDto.so_ct, stt_rec]
            );
            // 1. Tạo ph56 trước
            const ph56 = this.ph56Repository.create({
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
                ma_dvcs: 'CTY',
                ma_ct: 'BC1',
                tk: createDto.tk,
                t_thue_nt: 0,
                t_tien_nt: createDto.tong_tien ?? 0,
                t_thue: 0,
                t_tien: createDto.tong_tien ?? 0,
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
            await this.ph56Repository.insert(ph56);
            ph56Saved = ph56
        } catch (error) {
            throw new Error('Create ph56 failed: ' + error.message);
        }

        try {
            // 2. Tạo ct56 cho từng tài khoản trong array
            ct56Saved = [];
            if (Array.isArray(createDto.tai_khoan_list) && createDto.tai_khoan_list.length > 0) {
                for (let i = 0; i < createDto.tai_khoan_list.length; i++) {
                    const item = createDto.tai_khoan_list[i];
                    const ct56 = this.GiayBaoNoRepository.create({
                        stt_rec: stt_rec,
                        ma_ct: 'BC1',
                        ngay_ct: createDto.ngay_ct,
                        so_ct: createDto.so_ct ?? '',
                        dien_giaii: item.dien_giai ?? '', // lấy dien_giai từ từng item
                        tk_i: item.tk_i ?? '111', // lấy tk_i từ item hoặc default
                        tien_nt: item.ps_co ?? 0,
                        tien: item.ps_co ?? 0,
                        thue: 0.0,
                        thue_nt: 0.0,
                        tien_tt: item.ps_co,
                        stt_rec0: (i + 1).toString().padStart(3, '0'),
                        so_ct0: '',
                        ty_giahtf2: 0,
                    });
                    this.GiayBaoNoRepository.insert(ct56);
                    const saved = ct56
                    ct56Saved.push(saved);
                }
            }
        } catch (error) {
            // Nếu lỗi khi tạo ct56 thì xóa ph56
            if (ph56Saved) await this.ph56Repository.delete({ stt_rec });
            throw new Error('Create ct56 failed: ' + error.message);
        }
        try {
            const validGT = Array.isArray(createDto.hopDongThue)
                ? createDto.hopDongThue.filter(gt =>
                    Object.values(gt).some(val => val !== null && val !== '')
                )
                : [];
            for (let i = 0; i < validGT.length; i++) {
                const gt = validGT[i];
                const ct56gt = this.ct56gtRepository.create({
                    stt_rec: stt_rec,
                    stt_rec0: (i + 1).toString().padStart(3, '0'),
                    so_ct0: gt.so_ct0?.trim() || '',
                    ma_ms: gt.ma_ms?.trim() || '',
                    kh_mau_hd: gt.kh_mau_hd?.trim() || '',
                    so_seri0: gt.so_seri0?.trim() || '',
                    ngay_ct: gt.ngay_ct,
                    ma_kh: gt.ma_kh?.trim() || '',
                    ten_kh: gt.ten_kh?.trim() || '',
                    dia_chi: gt.dia_chi?.trim() || '',
                    ma_so_thue: gt.ma_so_thue?.trim() || '',
                    ten_vt: gt.ten_vt?.trim() || '',
                    t_tien: gt.t_tien ?? 0,
                    ma_thue: gt.ma_thue?.trim() || '',
                    thue_suat: gt.thue_suat ?? 0,
                    t_thue: gt.t_thue ?? 0,
                    tk_thue_no: gt.tk_thue_no?.trim() || '',
                    tk_du: gt.tk_du?.trim() || '',
                    t_tt: gt.t_tt ?? 0,
                });
                await this.ct56gtRepository.insert(ct56gt);
            }
        } catch (error) {
            throw new Error('Create ct00 failed: ' + error.message);
        }
        try {
            // 3. Tạo ct00 cho từng tài khoản trong array (mỗi item tạo 2 bản ghi)
            ct00Saved = [];
            if (Array.isArray(createDto.tai_khoan_list) && createDto.tai_khoan_list.length > 0) {
                for (let i = 0; i < createDto.tai_khoan_list.length; i++) {
                    const item = createDto.tai_khoan_list[i];
                    // Tạo 2 bản ghi: 1 bản ghi có ps_co, 1 bản ghi có ps_no
                    const records = [
                        { ps_co: item.ps_co ?? 0, ps_no: 0, stt_rec0: ((i * 2) + 1).toString().padStart(3, '0') },
                        { ps_co: 0, ps_no: item.ps_co ?? 0, stt_rec0: ((i * 2) + 2).toString().padStart(3, '0') }
                    ];
                    for (const rec of records) {
                        const ct00 = this.ct00Repository.create({
                            stt_rec: stt_rec,
                            stt_rec0: rec.stt_rec0,
                            ma_ct: 'BC1',
                            ma_gd: createDto.ma_gd ?? '',
                            ngay_ct: createDto.ngay_ct,
                            ngay_lct: createDto.ngay_lct,
                            so_ct: createDto.so_ct ?? '',
                            ong_ba: createDto.ong_ba ?? '',
                            dien_giai: item.dien_giai ?? '',
                            ma_nt: createDto.ma_nt ?? '',
                            ty_gia: createDto.ty_gia ?? 1,
                            ma_kh: createDto.ma_kh ?? '',
                            ma_qs: createDto.ma_qs ?? '',
                            nh_dk: "A01",
                            tk: item.tk_i,
                            tk_du: item.tk_me,
                            ps_no_nt: 0,
                            ps_co_nt: 0,
                            ty_gia_ht: 1,
                            ty_gia_ht2: 1,
                            ps_co: rec.ps_co,
                            ps_no: rec.ps_no,
                            ct_nxt: 0,
                            ma_vv: "",
                            status: '2',
                            ma_dvcs: 'CTY',
                            so_seri0: "",
                            loai_ct: '2',
                            dien_giai0: item.dien_giai ?? '',
                            nh_dkc: 'A01',
                        });
                        await this.ct00Repository.insert(ct00);
                        const saved = ct00
                        ct00Saved.push(saved);
                    }
                }
            }
        } catch (error) {
            // Nếu lỗi khi tạo ct00 thì xóa ct56 và ph56
            if (ct56Saved) await this.GiayBaoNoRepository.delete({ stt_rec });
            if (ph56Saved) await this.ph56Repository.delete({ stt_rec });
            throw new Error('Create ct00 failed: ' + error.message);
        }
        await this.dataSource.query(
            `EXEC [dbo].[CACTPC1-Post] @stt_rec = '${stt_rec}', @ma_ct = 'BN1'`
        );
        return { ct56: ct56Saved, ph56: ph56Saved, ct00: ct00Saved };
    }

    async findAll(query: QueryGiayBaoNoDto): Promise<{
        data: any[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
    }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;

        try {
            const queryBuilder = this.ph56Repository.createQueryBuilder('ph56');

            if (query.search) {
                const searchTerm = `%${query.search}%`;
                queryBuilder.andWhere(
                    '(ph56.ong_ba LIKE :search OR ph56.ma_gd LIKE :search OR ph56.so_ct LIKE :search)',
                    { search: searchTerm }
                );
            }

            const [ph56Records, total] = await queryBuilder
                .orderBy('ph56.stt_rec', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            const fullData = await Promise.all(
                ph56Records.map(async (ph) => {
                    const ct56List = await this.GiayBaoNoRepository.find({ where: { stt_rec: ph.stt_rec } });

                    const tai_khoan_list = ct56List.map((item) => ({
                        tk_so: item.tk_i,
                        tk_me: item.tk_i?.substring(0, 3) ?? '',
                        ten_tai_khoan: '',
                        ps_co: item.tien ?? 0,
                        dien_giai: item.dien_giaii ?? '',
                    }));

                    const tong_tien = tai_khoan_list.reduce((sum, tk) => sum + (tk.ps_co || 0), 0);

                    const ct00 = await this.ct00Repository.findOne({ where: { stt_rec: ph.stt_rec } });

                    // 🔽 Lấy danh sách hợp đồng thuế (ct56gt)
                    const hopDongThue = await this.ct56gtRepository.find({
                        where: { stt_rec: ph.stt_rec },
                    });

                    return {
                        stt_rec: ph.stt_rec,
                        ma_gd: ph.ma_gd,
                        ma_kh: ph.ma_kh,
                        dia_chi: ph.dia_chi,
                        mst: 0,
                        ong_ba: ph.ong_ba,
                        dien_giai: ph.dien_giai,
                        ngay_ct: ph.ngay_ct,
                        ngay_lct: ph.ngay_lct,
                        ma_qs: ph.ma_qs,
                        so_ct: ph.so_ct,
                        ma_nt: ph.ma_nt,
                        ty_gia: ph.ty_gia,
                        loai_ct: ph.loai_ct,
                        tai_khoan_list,
                        tong_tien,
                        han_thanh_toan: 0,
                        tk: ph.tk,
                        hopDongThue, // ✅ Trả thêm hợp đồng thuế ở đây
                    };
                })
            );

            return {
                data: fullData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new Error('FindAll GiayBaoNo failed: ' + error.message);
        }
    }


    async findOne(stt_rec: string): Promise<Ct56 | null> {
        try {
            return await this.GiayBaoNoRepository.findOneBy({ stt_rec });
        } catch (error) {
            throw new Error('FindOne GiayBaoNo failed: ' + error.message);
        }
    }

    /**
     * Cập nhật đồng thời ct56, ph56, ct00 theo dữ liệu từ DTO
     */
    async update(
        stt_rec: string,
        updateDto: UpdateGiayBaoNoDto
    ): Promise<{ ct56: Ct56[]; ph56: Ph56 | null; ct00: Ct00[] }> {
        try {
            await this.dataSource.query(
                `EXEC CheckValidSoct @Ma_qs = @0, @So_ct = @1, @Stt_rec = @2`,
                ["BC1", updateDto.so_ct, stt_rec]
            );
            // 1. Cập nhật ph56
            await this.ph56Repository.update({ stt_rec }, {
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

            const ph56 = await this.ph56Repository.findOne({ where: { stt_rec } });

            // 2. Xóa và tạo lại ct56
            await this.GiayBaoNoRepository.delete({ stt_rec });

            const ct56Saved: Ct56[] = [];

            if (Array.isArray(updateDto.tai_khoan_list)) {
                for (let i = 0; i < updateDto.tai_khoan_list.length; i++) {
                    const item = updateDto.tai_khoan_list[i];
                    const ct56 = this.GiayBaoNoRepository.create({
                        stt_rec,
                        ma_ct: 'BC1',
                        ngay_ct: updateDto.ngay_ct,
                        so_ct: updateDto.so_ct ?? '',
                        dien_giaii: item.dien_giai ?? '',
                        tk_i: item.tk_i ?? '111',
                        tien_nt: item.ps_co ?? 0,
                        tien: item.ps_co ?? 0,
                        thue: 0.0,
                        thue_nt: 0.0,
                        tien_tt: item.ps_co,
                        stt_rec0: (i + 1).toString().padStart(3, '0'),
                        so_ct0: '',
                        ty_giahtf2: 0,
                    });
                    await this.GiayBaoNoRepository.save(ct56);
                    ct56Saved.push(ct56);
                }
            }
            await this.ct56gtRepository.delete({ stt_rec });

            const ct56gtSaved: Ct56gt[] = [];

            if (Array.isArray(updateDto.hopDongThue)) {
                for (let i = 0; i < updateDto.hopDongThue.length; i++) {
                    const item = updateDto.hopDongThue[i];
                    const ct56gt = this.ct56gtRepository.create({
                        stt_rec,
                        stt_rec0: (i + 1).toString().padStart(3, '0'),
                        so_ct0: item.so_ct0 ?? '',
                        ngay_ct: item.ngay_ct,
                        tk_thue_no: item.tk_thue_no ?? '',
                        ma_ms: item.ma_ms ?? '',
                        kh_mau_hd: item.kh_mau_hd ?? '',
                        ma_kh: item.ma_kh ?? '',
                        so_seri0: item.so_seri0 ?? '',
                        ten_kh: item.ten_kh ?? '',
                        dia_chi: item.dia_chi ?? '',
                        ma_so_thue: item.ma_so_thue ?? '',
                        ten_vt: item.ten_vt ?? '',
                        ma_thue: item.ma_thue ?? '',
                        // ghi_chu: item.ghi_chu ?? '',
                        thue_suat: item.thue_suat ?? 0,
                        t_thue: item.t_thue ?? 0,
                        t_tien: item.t_tien ?? 0,
                        t_tt: item.t_tt ?? 0,
                        tk_du: item.tk_du ?? '',
                    });
                    await this.ct56gtRepository.save(ct56gt);
                    ct56gtSaved.push(ct56gt);
                }
            }
            // 3. Xóa và tạo lại ct00
            await this.ct00Repository.delete({ stt_rec });

            const ct00Saved: Ct00[] = [];

            if (Array.isArray(updateDto.tai_khoan_list)) {
                for (let i = 0; i < updateDto.tai_khoan_list.length; i++) {
                    const item = updateDto.tai_khoan_list[i];
                    const records = [
                        { ps_co: item.ps_co ?? 0, ps_no: 0, stt_rec0: ((i * 2) + 1).toString().padStart(3, '0') },
                        { ps_co: 0, ps_no: item.ps_co ?? 0, stt_rec0: ((i * 2) + 2).toString().padStart(3, '0') },
                    ];

                    for (const rec of records) {
                        const ct00 = this.ct00Repository.create({
                            stt_rec,
                            stt_rec0: rec.stt_rec0,
                            ma_ct: 'BC1',
                            ma_gd: updateDto.ma_gd ?? '',
                            ngay_ct: updateDto.ngay_ct,
                            ngay_lct: updateDto.ngay_lct,
                            so_ct: updateDto.so_ct ?? '',
                            ong_ba: updateDto.ong_ba ?? '',
                            dien_giai: item.dien_giai ?? '',
                            ma_nt: updateDto.ma_nt ?? '',
                            ty_gia: updateDto.ty_gia ?? 1,
                            ma_kh: updateDto.ma_kh ?? '',
                            ma_qs: updateDto.ma_qs ?? '',
                            nh_dk: 'A01',
                            tk: item.tk_i,
                            tk_du: item.tk_me,
                            ps_no_nt: 0,
                            ps_co_nt: 0,
                            ty_gia_ht: 1,
                            ty_gia_ht2: 1,
                            ps_co: rec.ps_co,
                            ps_no: rec.ps_no,
                            ct_nxt: 0,
                            ma_vv: '',
                            status: '2',
                            ma_dvcs: 'CTY',
                            so_seri0: '',
                            loai_ct: '2',
                            dien_giai0: item.dien_giai ?? '',
                            nh_dkc: 'A01',
                        });
                        await this.ct00Repository.save(ct00);
                        ct00Saved.push(ct00);
                    }
                }
            }
            await this.dataSource.query(
                `EXEC [dbo].[CACTPC1-Post] @stt_rec = '${stt_rec}', @ma_ct = 'BN1'`
            );
            return { ct56: ct56Saved, ph56, ct00: ct00Saved };
        } catch (error) {
            throw new Error('Update GiayBaoNo failed: ' + error.message);
        }
    }


    async remove(stt_rec: string): Promise<void> {
        try {
            // Xóa ct00 trước (nếu có)
            await this.ct00Repository.delete({ stt_rec });
            // Xóa ph56
            await this.ph56Repository.delete({ stt_rec });
            // Xóa ct56 cuối cùng
            await this.GiayBaoNoRepository.delete({ stt_rec });
        } catch (error) {
            throw new Error('Remove GiayBaoNo failed: ' + error.message);
        }
    }

    /**
     * Sinh mã stt_rec mới, đảm bảo không trùng trong bảng ph56
     */
    async generateUniqueSttRec(prefix = 'APT'): Promise<string> {
        try {
            const last = await this.ph56Repository.createQueryBuilder('ph56')
                .where("ph56.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
                .orderBy('ph56.stt_rec', 'DESC')
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
                const found = await this.ph56Repository.findOneBy({ stt_rec });
                isExist = !!found;
                if (isExist) nextNumber++;
            } while (isExist);
            return stt_rec;
        } catch (error) {
            throw new Error('Generate stt_rec failed: ' + error.message);
        }
    }
}
