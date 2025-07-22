import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCdvtDto } from "./cdvt.dto";
import { CdvtEntity } from "./cdvt.entity";

export class CdvtService {
    constructor(
        @InjectRepository(CdvtEntity)
        private readonly cdvtRepository: Repository<CdvtEntity>,
    ) { }
    async createCdvt(createCdvtDto: CreateCdvtDto): Promise<CdvtEntity> {
        const cdvt = this.cdvtRepository.create(createCdvtDto);
        return await this.cdvtRepository.save(cdvt);
    }
    async findById(ma_vt: string, ma_kho: string, nam: number) {
        return await this.cdvtRepository.findOne({ where: { ma_vt, ma_kho, nam } });
    }
    async updateCdvt(ma_vt: string, ma_kho: string, nam: number, updateCdvtDto: CreateCdvtDto) {
        await this.cdvtRepository.update({ ma_vt, ma_kho, nam }, updateCdvtDto);
        return this.findById(ma_vt, ma_kho, nam);
    }
    async deleteCdvt(ma_vt: string, ma_kho: string, nam: number): Promise<void> {
        await this.cdvtRepository.delete({ ma_vt, ma_kho, nam });
    }
    async findByMaKhoAndNam(maKho: string, nam: number, page = 1, limit = 10) {
        const [data, total] = await this.cdvtRepository.findAndCount({
            where: { ma_kho: maKho, nam },
            relations: ['vatTu'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}