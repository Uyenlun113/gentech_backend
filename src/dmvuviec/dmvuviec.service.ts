import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dmvuviec } from './entity/dmvuviec.entity';
import { CreateDmvuviecDto } from './dto/create-dmvuviec.dto';
import { QueryDmvuviecDto } from './dto/query.dto';

@Injectable()
export class DmvuviecService {
  constructor(
    @InjectRepository(Dmvuviec)
    private dmvuviecRepository: Repository<Dmvuviec>,
  ) {}

  async create(createDmvuviecDto: CreateDmvuviecDto): Promise<Dmvuviec> {
    const dmvuviec = this.dmvuviecRepository.create(createDmvuviecDto);
    return this.dmvuviecRepository.save(dmvuviec);
  }

  async findAll(query: QueryDmvuviecDto): Promise<{
    data: Dmvuviec[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    try {
      const queryBuilder = this.dmvuviecRepository.createQueryBuilder('dmvuviec');

      if (query.search) {
        const searchTerm = `%${query.search}%`;
        queryBuilder.where(
          '(dmvuviec.ma_vv LIKE :search OR dmvuviec.ten_vv LIKE :search)',
          { search: searchTerm }
        );
      }

      const [records, total] = await queryBuilder
        .orderBy('dmvuviec.ma_vv', 'ASC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: records,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error fetching records: ${error.message}`);
    }
  }

  async findOne(ma_vv: string): Promise<Dmvuviec> {
    const result = await this.dmvuviecRepository.findOne({ where: { ma_vv } });
    if (!result) {
      throw new NotFoundException(`Dmvuviec with ma_vv ${ma_vv} not found`);
    }
    return result;
  }

  async update(ma_vv: string, updateDmvuviecDto: CreateDmvuviecDto): Promise<Dmvuviec> {
    await this.dmvuviecRepository.update(ma_vv, updateDmvuviecDto);
    return this.findOne(ma_vv);
  }

  async remove(ma_vv: string): Promise<void> {
    await this.dmvuviecRepository.delete(ma_vv);
  }
}
