import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Dmhdm } from './entity/dmhdm.entity';
import { Dmhdmct } from './entity/dmhdmct.entity';
import { CreateDonHangMuaDto, HangHoaItemDto } from './dto/create-donhangmua.dto';
import { UpdateDonhangmuaDto } from './dto/update-donhangmua.dto';
import { Material } from '../material/material.entity';

@Injectable()
export class DonhangmuaService {
    constructor(
        @InjectRepository(Dmhdm)
        private dmhdmRepo: Repository<Dmhdm>,
        @InjectRepository(Dmhdmct)
        private dmhdmctRepo: Repository<Dmhdmct>,
        @InjectRepository(Material)
        private MaterialRepo: Repository<Material>,
        private readonly dataSource: DataSource
    ) { }

    async create(dto: CreateDonHangMuaDto) {
        // 1. Lưu vào dmhdm
        try {
            const stt_rec = await this.generateUniqueSttRec();
            const { hang_hoa_list, ...phData } = dto;
            const dmhdm = {
                stt_rec,
                ...phData,
            };
            const savedDmhdm = await this.dmhdmRepo.save(dmhdm);

            const dataDmhdm = await this.dmhdmRepo.findOne({ where: { stt_rec: stt_rec } });
            // 2. Lưu vào dmhdmct cho từng cặp hàng hóa và chi phí
            const hangHoaList = dto.hang_hoa_list || [];

            for (let i = 0; i < hangHoaList.length; i++) {
                const hangHoa = hangHoaList[i];

                const ct = this.dmhdmctRepo.create({
                    stt_rec,
                    stt_rec0: (i + 1).toString().padStart(3, '0'),
                    ma_ct: dataDmhdm?.ma_ct?.trim() ?? '',
                    ngay_ct: dataDmhdm?.ngay_ct,
                    so_ct: dataDmhdm?.so_ct?.trim() ?? '',
                    ma_vt: hangHoa.ma_vt ? hangHoa.ma_vt.trim() : '',
                    tien0: Number(hangHoa.tien0 ?? 0),
                    tien_nt0: Number(hangHoa.tien_nt0 ?? 0),
                    ma_thue: hangHoa.ma_thue ? hangHoa.ma_thue.trim() : '',
                    thue_suat: Number(hangHoa.thue_suat ?? 0),
                    thue: Number(hangHoa.thue ?? 0),
                    cp: Number(hangHoa.cp ?? 0),
                    ma_kho_i: hangHoa.ma_kho_i ? hangHoa.ma_kho_i.trim() : '',
                    so_luong: Number(hangHoa.so_luong ?? 0),
                    gia0: Number(hangHoa.gia0 ?? 0),
                    gia_nt0: Number(hangHoa.gia_nt0 ?? 0),
                    tien: Number(hangHoa.tien ?? 0),
                    tien_nt: Number(hangHoa.tien_nt ?? 0),
                    tk_vt: hangHoa.tk_vt ? hangHoa.tk_vt.trim() : '',
                    gia: Number(hangHoa.gia ?? 0),
                    gia_nt: Number(hangHoa.gia_nt ?? 0),

                });
                await this.dmhdmctRepo.save(ct);
            }
            await this.dataSource.query(
                `EXEC [dbo].[PODMHDM-Post] @stt_rec = '${stt_rec}'`
            );
            return this.getOne(stt_rec);
        } catch (err) {
            console.log('Error creating DonHangMua:', err);
        }
    }

    async update(id: string, dto: UpdateDonhangmuaDto) {
        try {
            // 1. Tìm đơn hàng gốc
            const dmhdm = await this.dmhdmRepo.findOne({ where: { stt_rec: id } });
            if (!dmhdm) return null;

            const { hang_hoa_list = [], ...phData } = dto;

            // 2. Xóa chi tiết cũ
            await this.dmhdmctRepo.delete({ stt_rec: id });

            // 3. Ghi lại danh sách chi tiết mới
            let t_thue = 0;
            let t_tien = 0;
            let t_tien_nt = 0;
            let t_cp = 0
            let t_tt = 0

            for (let i = 0; i < hang_hoa_list.length; i++) {
                const hangHoa = hang_hoa_list[i];

                const tien0 = Number(hangHoa.tien0 ?? 0);
                const tien_nt = Number(hangHoa.tien_nt ?? 0);
                const thue = Number(hangHoa.thue ?? 0);
                const cp = Number(hangHoa.cp ?? 0);

                // Cộng dồn tổng
                t_thue += thue;
                t_tien += tien0;
                t_tien_nt += tien_nt
                t_cp += cp
                t_tt = t_thue + t_tien + t_cp

                const ct = this.dmhdmctRepo.create({
                    stt_rec: id,
                    stt_rec0: (i + 1).toString().padStart(3, '0'),
                    ma_ct: dmhdm.ma_ct?.trim() ?? '',
                    ngay_ct: dmhdm.ngay_ct,
                    so_ct: dmhdm.so_ct?.trim() ?? '',
                    ma_vt: hangHoa.ma_vt?.trim() || '',
                    tien0,
                    // tien_nt0,
                    ma_thue: hangHoa.ma_thue?.trim() || '',
                    thue_suat: Number(hangHoa.thue_suat ?? 0),
                    thue,
                    cp,
                    ma_kho_i: hangHoa.ma_kho_i?.trim() || '',
                    so_luong: Number(hangHoa.so_luong ?? 0),
                    gia0: Number(hangHoa.gia0 ?? 0),
                    gia_nt0: Number(hangHoa.gia_nt0 ?? 0),
                    // tien,
                    tien_nt,
                    tk_vt: hangHoa.tk_vt?.trim() || '',
                    gia: Number(hangHoa.gia ?? 0),
                    gia_nt: Number(hangHoa.gia_nt ?? 0),
                });

                await this.dmhdmctRepo.save(ct);
            }

            // 4. Cập nhật đơn hàng (thông tin chung + tổng)
            await this.dmhdmRepo.update(
                { stt_rec: id },
                {
                    ...phData,
                    t_thue,
                    t_tien,
                    t_tien_nt,
                    t_tt,
                }
            );

            // 5. Gọi stored procedure cập nhật
            await this.dataSource.query(`EXEC [dbo].[PODMHDM-Post] @stt_rec = '${id}'`);

            // 6. Trả về dữ liệu đã cập nhật
            return this.getOne(id);
        } catch (err) {
            console.log('Error updating DonHangMua:', err);
            throw err;
        }
    }


    async findAll(query: { search?: string; page?: number; limit?: number }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const search = query.search?.trim();

        const qb = this.dmhdmRepo.createQueryBuilder('dmhdm');

        if (search) {
            qb.where(
                `dmhdm.so_ct LIKE :search OR
                 dmhdm.ma_kh LIKE :search OR 
                 dmhdm.ma_hdm LIKE :search`,
                { search: `%${search}%` }
            );
        }

        qb.skip((page - 1) * limit).take(limit).orderBy('dmhdm.ngay_ct', 'DESC');

        const [results, total] = await qb.getManyAndCount();

        const data = await Promise.all(
            results.map(async (dmhdm) => {
                const record = await this.getOne(dmhdm.stt_rec);

                if (!record) {
                    return null; // hoặc return {}; hoặc throw error tùy use-case
                }

                const enrichedHangHoaList = await Promise.all(
                    (record.hang_hoa_list || []).map(async (item) => {
                        const material = await this.MaterialRepo.findOne({
                            where: { ma_vt: item.ma_vt },
                            select: ['ten_vt', 'dvt'],
                        });

                        return {
                            ...item,
                            ten_vt: material?.ten_vt || '',
                            dvt: material?.dvt || '',
                        };
                    })
                );

                return {
                    ...record,
                    hang_hoa_list: enrichedHangHoaList,
                };
            })
        );
        // Nếu bạn muốn loại bỏ các kết quả null
        // const filteredData = data.filter(Boolean);


        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getOne(id: string) {
        const dmhdm = await this.dmhdmRepo.findOne({ where: { stt_rec: id } });
        if (!dmhdm) return null;

        const dmhdmcts = await this.dmhdmctRepo.find({
            where: { stt_rec: id },
            order: { stt_rec0: 'ASC' },
        });
        const hang_hoa_list = dmhdmcts.map((ct) => ({
            ma_vt: ct.ma_vt.trim(),
            tien_nt0: ct.tien_nt0,
            ma_thue: ct.ma_thue,
            thue_suat: ct.thue_suat,
            thue: ct.thue,
            ma_kho_i: ct.ma_kho_i,
            so_luong: ct.so_luong,
            gia0: ct.gia0,
            gia_nt0: ct.gia_nt0,
            cp_nt: ct.cp_nt,
            cp: ct.cp,
            tien0: ct.tien0,
            tien: ct.tien,
            tien_nt: ct.tien_nt,
            tk_vt: ct.tk_vt,
            gia: ct.gia,
            gia_nt: ct.gia_nt,
        }));

        return {
            ...dmhdm,
            hang_hoa_list,
        };
    }


    async remove(id: string) {
        // Xóa chi tiết trước
        await this.dmhdmctRepo.delete({ stt_rec: id });

        // Xóa bản ghi chính
        return this.dmhdmRepo.delete(id);
    }

    async generateUniqueSttRec(prefix = 'AHDM'): Promise<string> {
        try {
            const last = await this.dmhdmRepo.createQueryBuilder('dmhdm')
                .where("dmhdm.stt_rec LIKE :prefix", { prefix: `${prefix}%` })
                .orderBy('dmhdm.stt_rec', 'DESC')
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
                const found = await this.dmhdmRepo.findOneBy({ stt_rec });
                isExist = !!found;
                if (isExist) nextNumber++;
            } while (isExist);
            return stt_rec;
        } catch (error) {
            throw new Error('Generate stt_rec failed: ' + error.message);
        }
    }
}