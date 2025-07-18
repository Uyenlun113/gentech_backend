import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmsttEntity } from './dmstt.entity';

@Injectable()
export class DmsttService {
    constructor(
        @InjectRepository(DmsttEntity)
        private readonly dmsttRepo: Repository<DmsttEntity>,
    ) { }

    async findAll(): Promise<Partial<DmsttEntity>[]> {
        return this.dmsttRepo.find();
    }

    async updateNgayKy1(stt_rec: number, ngay_ky1: string) {
        try {
            const record = await this.dmsttRepo.findOne({ where: { stt_rec } });

            if (!record) {
                throw new NotFoundException(`Không tìm thấy dòng với stt_rec = ${stt_rec}`);
            }

            record.ngay_ky1 = new Date(ngay_ky1);
            const result = await this.dmsttRepo.save(record);
            return {
                message: 'Cập nhật ngay_ky1 thanh cong',
                data: result
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi cập nhật ngay_ky1: ${error.message}`);
        }
    }
}
