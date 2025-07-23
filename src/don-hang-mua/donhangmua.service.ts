import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Dmhdm } from './entity/dmhdm.entity';
import { Dmhdmct } from './entity/dmhdmct.entity';
import { CreateDonHangMuaDto, HangHoaItemDto, ChiPhiItemDto } from './dto/create-donhangmua.dto';
import { UpdateDonhangmuaDto } from './dto/update-donhangmua.dto';

@Injectable()
export class DonhangmuaService {
    constructor(
        @InjectRepository(Dmhdm)
        private dmhdmRepo: Repository<Dmhdm>,
        @InjectRepository(Dmhdmct)
        private dmhdmctRepo: Repository<Dmhdmct>,
        private readonly dataSource: DataSource
    ) { }

    async create(dto: CreateDonHangMuaDto) {
        // 1. Lưu vào dmhdm
        const stt_rec = await this.generateUniqueSttRec();
        const { hang_hoa_list, ...phData } = dto;
        const dmhdm = this.dmhdmRepo.create({
            ...phData,
            stt_rec,
        });
        const savedDmhdm = await this.dmhdmRepo.save(dmhdm);

        // 2. Lưu vào dmhdmct cho từng cặp hàng hóa và chi phí
        const hangHoaList = dto.hang_hoa_list || [];
        const chiPhiList = dto.chi_phi_list || [];
        for (let i = 0; i < hangHoaList.length; i++) {
            const hangHoa = hangHoaList[i];
            const chiPhi = chiPhiList[i];
            const ct = this.dmhdmctRepo.create({
                stt_rec: stt_rec,
                stt_rec0: (i + 1).toString().padStart(3, '0'),
                ma_ct: savedDmhdm.ma_ct,
                ngay_ct: savedDmhdm.ngay_ct,
                so_ct: savedDmhdm.so_ct,
                // Hàng hóa
                ma_vt: hangHoa?.ma_vt ?? '',
                tien0: Number(hangHoa?.tien0) ?? 0,
                tien_nt0: Number(hangHoa?.tien_nt0) ?? 0,
                ma_thue: Number(hangHoa?.ma_thue) ?? 0,
                thue_suat: Number(hangHoa?.thue_suat) ?? 0,
                thue: Number(hangHoa?.thue) ?? 0,
                // Chi phí
                cp: chiPhi?.cp ?? 0,
                // Các trường khác mặc định
            });
            await this.dmhdmctRepo.save(ct);
        }
        await this.dataSource.query(
            `EXEC [dbo].[PODMHDM-Post] @stt_rec = '${stt_rec}'`
        );
        return this.getOne(savedDmhdm.stt_rec);
    }

    async update(id: string, dto: UpdateDonhangmuaDto) {
        // Cập nhật dmhdm
        const dmhdm = await this.dmhdmRepo.findOne({ where: { stt_rec: id } });
        if (!dmhdm) return null;

        const { hang_hoa_list, ...phData } = dto;
        await this.dmhdmRepo.update({ stt_rec: id }, phData);
        // Xóa chi tiết cũ
        await this.dmhdmctRepo.delete({ stt_rec: dmhdm.stt_rec });

        // Lưu lại chi tiết mới
        const hangHoaList = dto.hang_hoa_list || [];
        const chiPhiList = dto.chi_phi_list || [];
        for (let i = 0; i < hangHoaList.length; i++) {
            const hangHoa = hangHoaList[i];
            const chiPhi = chiPhiList[i];
            const ct = this.dmhdmctRepo.create({
                stt_rec: dmhdm.stt_rec,
                stt_rec0: (i + 1).toString().padStart(3, '0'),
                ma_ct: dmhdm.ma_ct,
                ngay_ct: dmhdm.ngay_ct,
                so_ct: dmhdm.so_ct,
                ma_vt: hangHoa?.ma_vt ?? '',
                tien0: Number(hangHoa?.tien0) ?? 0,
                tien_nt0: Number(hangHoa?.tien_nt0) ?? 0,
                ma_thue: Number(hangHoa?.ma_thue) ?? 0,
                thue_suat: Number(hangHoa?.thue_suat) ?? 0,
                thue: Number(hangHoa?.thue) ?? 0,
                cp: chiPhi?.cp ?? 0,
            });
            await this.dmhdmctRepo.save(ct);
        }
        await this.dataSource.query(
            `EXEC [dbo].[PODMHDM-Post] @stt_rec = '${dmhdm.stt_rec}'`
        );
        return this.getOne(id);
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
            results.map((dmhdm) => this.getOne(dmhdm.stt_rec))
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
    }

    async getOne(id: string) {
        const dmhdm = await this.dmhdmRepo.findOne({ where: { stt_rec: id } });
        if (!dmhdm) return null;
        const dmhdmcts = await this.dmhdmctRepo.find({ where: { stt_rec: id }, order: { stt_rec0: 'ASC' } });

        // Map lại thành 2 array đúng với DTO
        const hang_hoa_list: any[] = [];
        const chi_phi_list: any[] = [];
        for (const ct of dmhdmcts) {
            hang_hoa_list.push({
                ma_vt: ct.ma_vt,
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
            });
            chi_phi_list.push({
                ma_vt: ct.ma_vt,
                tien_nt0: ct.tien_nt0,
                cp: ct.cp,
            });
        }

        return {
            ...dmhdm,
            hang_hoa_list,
            chi_phi_list,
        };
    }

    remove(id: string) {
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