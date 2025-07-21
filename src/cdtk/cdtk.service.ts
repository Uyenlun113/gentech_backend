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

        // Kiểm tra xem có bản ghi nào đã tồn tại hay chưa
        const existing = await this.cdtkRepo.findOne({
            where: {
                nam: first.nam,
                tk: first.tk,
                ma_dvcs: first.ma_dvcs,
            },
        });

        // Nếu đã tồn tại 1 bản ghi => bỏ qua luôn
        if (existing) {
            return [];
        }

        // Nếu chưa tồn tại, duyệt từng phần tử và insert nếu chưa có
        const result: CdtkEntity[] = [];

        for (const item of data) {
            const newItem = this.cdtkRepo.create(item);
            result.push(await this.cdtkRepo.save(newItem));
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
