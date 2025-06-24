import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    ) { }

    async save(dto: SaveGeneralAccountingDto) {
        const { phieu, hachToan, hopDongThue } = dto;

        const stt_rec = `APK${Date.now()}`.substring(0, 11);
        const ma_dvcs = 'CTY';
        const ma_gd = '1';
        const ma_ct = phieu.ma_ct;
        const ngay_ct = new Date(phieu.ngay_lct);
        await this.ph11Repo.save({
            ...phieu,
            ma_ct,
            stt_rec,
            ngay_ct,
        });
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
        const validHopDongThue = (Array.isArray(hopDongThue) ? hopDongThue : []).filter(gt =>
            Object.values(gt).some(val => val !== null && val !== '')
        );
        if (validHopDongThue.length > 0) {
            await this.ct11gtRepo.save(
                validHopDongThue.map(gt => ({
                    ...gt,
                    stt_rec,
                }))
            );
        }
        await this.ct00Repo.save({
            ma_ct,
            ma_dvcs,
            ma_gd,
            stt_rec,
            ma_kh: validHopDongThue[0]?.ma_kh?.trim() || null,
            ngay_ct,
        });

        return { message: 'Lưu thành công' };
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