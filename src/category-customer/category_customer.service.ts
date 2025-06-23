import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CategoryCustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        try {
            const ma_kh = await this.generateNextCustomerCode();
            const customer = this.customerRepository.create({
                ma_kh,
                ...createCustomerDto
            });
            return await this.customerRepository.save(customer);
        } catch (error) {
            throw new BadRequestException('Không thể tạo khách hàng mới');
        }
    }

    private async generateNextCustomerCode(): Promise<string> {
        const latestCustomer = await this.customerRepository
            .createQueryBuilder('customer')
            .where('customer.ma_kh LIKE :pattern', { pattern: 'KH%' })
            .orderBy('customer.ma_kh', 'DESC')
            .getOne();

        if (!latestCustomer) {
            return 'KH001';
        }
        const latestNumber = latestCustomer.ma_kh.substring(2);
        const nextNumber = parseInt(latestNumber) + 1;
        const formattedNumber = nextNumber.toString().padStart(3, '0');
        return `KH${formattedNumber}`;
    }

    async findAll(queryDto: QueryCustomerDto) {
        const { search, status, dateFrom, dateTo, page = 1, limit = 10 } = queryDto;

        const queryBuilder = this.customerRepository.createQueryBuilder('customer');

        if (search) {
            queryBuilder.andWhere(
                `(customer.ma_kh LIKE :search 
                OR customer.ten_kh LIKE :search 
                OR customer.e_mail LIKE :search 
                OR customer.dien_thoai LIKE :search)`,
                { search: `%${search}%` }
            );
        }

        if (status) {
            queryBuilder.andWhere('customer.status = :status', { status });
        }

        if (dateFrom && dateTo) {
            queryBuilder.andWhere('customer.date BETWEEN :dateFrom AND :dateTo', {
                dateFrom: new Date(dateFrom),
                dateTo: new Date(dateTo),
            });
        }

        const skip = (page - 1) * limit;

        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('customer.date', 'DESC');

        const [data, total] = await queryBuilder.getManyAndCount();

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


    async findOne(ma_kh: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { ma_kh }
        });

        if (!customer) {
            throw new NotFoundException('Không tìm thấy khách hàng');
        }

        return customer;
    }

    async update(ma_kh: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        const customer = await this.findOne(ma_kh);

        Object.assign(customer, updateCustomerDto);
        return await this.customerRepository.save(customer);
    }

    async remove(ma_kh: string): Promise<void> {
        const customer = await this.findOne(ma_kh);
        await this.customerRepository.remove(customer);
    }
}