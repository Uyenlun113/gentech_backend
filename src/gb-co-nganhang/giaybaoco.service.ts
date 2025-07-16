import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Ct51 } from './entity/ct51.entity';
import { Ph51 } from './entity/ph51.entity';
import { Ct00 } from './entity/ct00.entity';
import { CreateGiayBaoCoDto } from './dto/create-giaybaoco.dto';
import { UpdateGiayBaoCoDto } from './dto/update-giaybaoco.dto';
import { QueryGiayBaoCoDto } from './dto/query-giaybaoco.dto';

@Injectable()
export class GiayBaoCoService {
    constructor(
        @InjectRepository(Ct51)
        private readonly GiayBaoCoRepository: Repository<Ct51>,
        @InjectRepository(Ph51)
        private readonly ph51Repository: Repository<Ph51>,
        @InjectRepository(Ct00)
        private readonly ct00Repository: Repository<Ct00>,
        private readonly dataSource: DataSource
    ) { }

    /**
     * Tạo mới bản ghi ở ph51, ct51, ct00 theo dữ liệu từ DTO
     */
    async create(createDto: CreateGiayBaoCoDto): Promise<{ ct51: Ct51[]; ph51: Ph51; ct00: Ct00[] }> {
        // 1. Sinh mã stt_rec
        const stt_rec = await this.generateUniqueSttRec();
        let ph51Saved: Ph51 | null = null;
        let ct51Saved: Ct51[] = [];
        let ct00Saved: Ct00[] = [];
        try {
            // 1. Tạo ph51 trước
            const ph51 = this.ph51Repository.create({
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
            await this.ph51Repository.insert(ph51);
            ph51Saved = ph51
        } catch (error) {
            throw new Error('Create ph51 failed: ' + error.message);
        }

        try {
            // 2. Tạo ct51 cho từng tài khoản trong array
            ct51Saved = [];
            if (Array.isArray(createDto.tai_khoan_list) && createDto.tai_khoan_list.length > 0) {
                for (let i = 0; i < createDto.tai_khoan_list.length; i++) {
                    const item = createDto.tai_khoan_list[i];
                    const ct51 = this.GiayBaoCoRepository.create({
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
                    this.GiayBaoCoRepository.insert(ct51);
                    const saved = ct51
                    ct51Saved.push(saved);
                }
            }
        } catch (error) {
            // Nếu lỗi khi tạo ct51 thì xóa ph51
            if (ph51Saved) await this.ph51Repository.delete({ stt_rec });
            throw new Error('Create ct51 failed: ' + error.message);
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
            // Nếu lỗi khi tạo ct00 thì xóa ct51 và ph51
            if (ct51Saved) await this.GiayBaoCoRepository.delete({ stt_rec });
            if (ph51Saved) await this.ph51Repository.delete({ stt_rec });
            throw new Error('Create ct00 failed: ' + error.message);
        }
        await this.dataSource.query(
            `EXEC [dbo].[CACTPT1-Post] @stt_rec = '${stt_rec}', @ma_ct = 'BC1'`
        );
        return { ct51: ct51Saved, ph51: ph51Saved, ct00: ct00Saved };
    }

    async findAll(query: QueryGiayBaoCoDto): Promise<{
        data: any[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
    }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;

        try {
            const queryBuilder = this.ph51Repository.createQueryBuilder('ph51');

            if (query.search) {
                const searchTerm = `%${query.search}%`;
                queryBuilder.andWhere(
                    '(ph51.ong_ba LIKE :search OR ph51.ma_gd LIKE :search OR ph51.so_ct LIKE :search)',
                    { search: searchTerm }
                );
            }

            const [ph51Records, total] = await queryBuilder
                .orderBy('ph51.stt_rec', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            // Build full records with ct51 and ct00
            const fullData = await Promise.all(
                ph51Records.map(async (ph) => {
                    const ct51List = await this.GiayBaoCoRepository.find({ where: { stt_rec: ph.stt_rec } });

                    const tai_khoan_list = ct51List.map((item) => ({
                        tk_so: item.tk_i,
                        tk_me: item.tk_i?.substring(0, 3) ?? '',
                        ten_tai_khoan: '', // Nếu có mapping thì xử lý, hoặc dùng enum từ DB
                        ps_co: item.tien ?? 0,
                        dien_giai: item.dien_giaii ?? '',
                    }));

                    const tong_tien = tai_khoan_list.reduce((sum, tk) => sum + (tk.ps_co || 0), 0);

                    const ct00 = await this.ct00Repository.findOne({ where: { stt_rec: ph.stt_rec } });

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
                        han_thanh_toan: 0, // nếu có, hoặc lấy từ ph51 nếu lưu ở đó
                        tk: ph.tk,
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
            throw new Error('FindAll GiayBaoCo failed: ' + error.message);
        }
    }

    async findOne(stt_rec: string): Promise<Ct51 | null> {
        try {
            return await this.GiayBaoCoRepository.findOneBy({ stt_rec });
        } catch (error) {
            throw new Error('FindOne GiayBaoCo failed: ' + error.message);
        }
    }

    /**
     * Cập nhật đồng thời ct51, ph51, ct00 theo dữ liệu từ DTO
     */
    async update(
        stt_rec: string,
        updateDto: UpdateGiayBaoCoDto
    ): Promise<{ ct51: Ct51[]; ph51: Ph51 | null; ct00: Ct00[] }> {
        try {
            // 1. Cập nhật ph51
            await this.ph51Repository.update({ stt_rec }, {
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

            const ph51 = await this.ph51Repository.findOne({ where: { stt_rec } });

            // 2. Xóa và tạo lại ct51
            await this.GiayBaoCoRepository.delete({ stt_rec });

            const ct51Saved: Ct51[] = [];

            if (Array.isArray(updateDto.tai_khoan_list)) {
                for (let i = 0; i < updateDto.tai_khoan_list.length; i++) {
                    const item = updateDto.tai_khoan_list[i];
                    const ct51 = this.GiayBaoCoRepository.create({
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
                    await this.GiayBaoCoRepository.save(ct51);
                    ct51Saved.push(ct51);
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

            return { ct51: ct51Saved, ph51, ct00: ct00Saved };
        } catch (error) {
            throw new Error('Update GiayBaoCo failed: ' + error.message);
        }
    }


    async remove(stt_rec: string): Promise<void> {
        try {
            // Xóa ct00 trước (nếu có)
            await this.ct00Repository.delete({ stt_rec });
            // Xóa ph51
            await this.ph51Repository.delete({ stt_rec });
            // Xóa ct51 cuối cùng
            await this.GiayBaoCoRepository.delete({ stt_rec });
        } catch (error) {
            throw new Error('Remove GiayBaoCo failed: ' + error.message);
        }
    }

    /**
     * Sinh mã stt_rec mới, đảm bảo không trùng trong bảng ph51
     */
    async generateUniqueSttRec(prefix = 'APT'): Promise<string> {
        try {
            const last = await this.ph51Repository.createQueryBuilder('ph51')
                .where("ph51.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
                .orderBy('ph51.stt_rec', 'DESC')
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
                const found = await this.ph51Repository.findOneBy({ stt_rec });
                isExist = !!found;
                if (isExist) nextNumber++;
            } while (isExist);
            return stt_rec;
        } catch (error) {
            throw new Error('Generate stt_rec failed: ' + error.message);
        }
    }
}
