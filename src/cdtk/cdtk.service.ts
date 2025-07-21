import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CdtkDto } from './cdtk.dto';
import { CdtkEntity } from './cdtk.entity';

@Injectable()
export class CdtkService {
    constructor(
        @InjectRepository(CdtkEntity)
        private readonly cdtkRepo: Repository<CdtkEntity>,
    ) { }

    async createBulk(data: CdtkDto[]): Promise<CdtkEntity[]> {
        const first = data[0];
        const existing = await this.cdtkRepo.findOne({
            where: {
                nam: first.nam,
                tk: first.tk,
                ma_dvcs: first.ma_dvcs,
            },
        });
        if (existing) {
            return [];
        }
        const result: CdtkEntity[] = [];
        for (const item of data) {
            const newItem = this.cdtkRepo.create(item);
            result.push(await this.cdtkRepo.save(newItem));
        }

        return result;
    }


    async findByYear(nam: number): Promise<CdtkEntity[]> {
        const data = await this.cdtkRepo.find({
            where: { nam },
            relations: ['account'], 
            order: { tk: 'ASC' },
        });
        return data;
    }


    async updateByTkAndYear(tk: string, nam: number, data: CdtkDto) {
        const existing = await this.cdtkRepo.findOne({ where: { tk, nam } });
        if (!existing) {
            throw new NotFoundException(`Không tìm thấy dữ liệu với tk: ${tk}, năm: ${nam}`);
        }
        const updated = await this.cdtkRepo.update({ tk, nam }, {
            ...data,
            tk,
            nam,
            ma_dvcs: existing.ma_dvcs,
        });

        return updated;
    }

    async findOne(tk: string, nam: number) {
        const data = await this.cdtkRepo.findOne({ where: { tk, nam } });
        return data;
    }
}
