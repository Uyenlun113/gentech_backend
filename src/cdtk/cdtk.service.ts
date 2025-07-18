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

    // ✅ Thêm mới
    async createBulk(data: CdtkDto[]): Promise<CdtkEntity[]> {
        const result: CdtkEntity[] = [];

        for (const item of data) {
            const existing = await this.cdtkRepo.findOne({
                where: {
                    nam: item.nam,
                    tk: item.tk,
                },
            });

            if (!existing) {
                const newItem = this.cdtkRepo.create(item);
                const saved = await this.cdtkRepo.save(newItem);
                result.push(saved);
            }
        }

        return result;
    }

    // ✅ Lấy danh sách theo năm
    async findByYear(nam: number): Promise<CdtkEntity[]> {
        const data = await this.cdtkRepo.find({
            where: { nam },
            relations: ['account'], // Load account data
            order: { tk: 'ASC' },
        });
        return data;
    }

    // ✅ Cập nhật theo tk và năm
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
