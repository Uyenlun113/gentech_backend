import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CategoryCustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        private dataSource: DataSource
    ) { }
    //danh sách danh mục khách hàng
    async findAll(queryDto: QueryCustomerDto) {
        const { page = 1, limit = 10, search, status } = queryDto;
        try {
            const queryBuilder = this.customerRepository.createQueryBuilder('customer');
            if (search) {
                queryBuilder.where(
                    '(customer.ma_kh LIKE :search OR customer.ten_kh LIKE :search)',
                    { search: `%${search}%` }
                );
            }
            if (status) {
                if (search) {
                    queryBuilder.andWhere('customer.status = :status', { status });
                } else {
                    queryBuilder.where('customer.status = :status', { status });
                }
            }
            const [data, total] = await queryBuilder
                .orderBy('customer.ma_kh', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách khách hàng: ${error.message}`);
        }
    }
    //thêm mới danh mục khách hàng
    // kiểm tra mã khách hàng có trùng lặp hay không
    async create(dto: CreateCustomerDto) {
        try {
            const ma_kh = await this.generateNextCustomerCode();
            await this.dataSource.query(
                `EXEC CheckStringContainDM @table_name = @0, @table_key = @1, @new_value = @2, @old_value = @3`,
                ['dmkh', 'ma_kh', ma_kh, '']
            );
            const customer = this.customerRepository.create({
                ma_kh,
                ten_kh: dto.ten_kh,
                e_mail: dto.e_mail,
                dien_thoai: dto.dien_thoai,
                dia_chi: dto.dia_chi,
                ma_so_thue: dto.ma_so_thue,
                ma_tra_cuu: dto.ma_tra_cuu,
                tk_nh: dto.tk_nh,
                ten_nh: dto.ten_nh,
                ghi_chu: dto.ghi_chu,
                status: dto.status || 'A',
                nh_kh1: dto.nh_kh1,
                nh_kh2: dto.nh_kh2,
                nh_kh3: dto.nh_kh3
            });
            const savedCustomer = await this.customerRepository.save(customer);
            return {
                message: 'Thêm khách hàng thành công',
                ma_kh,
                data: savedCustomer
            };
        } catch (error) {
            if (error.message?.includes('trùng') || error.message?.includes('duplicate')) {
                throw new BadRequestException('Mã khách hàng đã tồn tại hoặc bị trùng lồng');
            }
            throw new BadRequestException(`Lỗi khi tạo khách hàng: ${error.message}`);
        }
    }
    //cập nhật danh mục khách hàng
    async update(ma_kh: string, dto: UpdateCustomerDto) {
        try {
            const existingCustomer = await this.findOne(ma_kh);
            await this.dataSource.query(
                `EXEC CheckStringContainDM @table_name = @0, @table_key = @1, @new_value = @2, @old_value = @3`,
                ['dmkh', 'ma_kh', ma_kh, ma_kh]
            );
            Object.assign(existingCustomer, dto);
            const updatedCustomer = await this.customerRepository.save(existingCustomer);
            return {
                message: 'Cập nhật khách hàng thành công',
                ma_kh,
                data: updatedCustomer
            };

        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Lỗi khi cập nhật khách hàng: ${error.message}`);
        }
    }
    //xóa danh mục khách hàng
    // kiểm tra mã khách hàng có đang được sử dụng trong các chứng từ khác hay không
    async remove(ma_kh: string) {
        try {
            const customer = await this.findOne(ma_kh);
            const checkResult = await this.dataSource.query(
                `EXEC CheckDeleteListId @ma_dm = @0, @value = @1`,
                ['dmkh', ma_kh]
            );
            if (checkResult && checkResult[0] && checkResult[0][''] === 0) {
                throw new BadRequestException('Không thể xóa khách hàng này vì đang được sử dụng trong các chứng từ khác');
            }
            await this.customerRepository.remove(customer);
            return { message: 'Xóa khách hàng thành công', ma_kh };

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi xóa khách hàng: ${error.message}`);
        }
    }
    //lấy thông tin chi tiết khách hàng theo mã
    async findOne(ma_kh: string): Promise<Customer> {
        try {
            const customer = await this.customerRepository.findOne({
                where: { ma_kh }
            });
            if (!customer) {
                throw new NotFoundException(`Không tìm thấy khách hàng với mã: ${ma_kh}`);
            }
            return customer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi tìm khách hàng: ${error.message}`);
        }
    }
    //tạo mã khách hàng tự động
    // mã khách hàng có định dạng KH001, KH002, ...
    private async generateNextCustomerCode(): Promise<string> {
        try {
            const latestCustomer = await this.customerRepository
                .createQueryBuilder('customer')
                .where("customer.ma_kh LIKE 'KH%'")
                .andWhere("ISNUMERIC(SUBSTRING(customer.ma_kh, 3, LEN(customer.ma_kh))) = 1")
                .orderBy("CAST(SUBSTRING(customer.ma_kh, 3, LEN(customer.ma_kh)) AS INT)", "DESC")
                .limit(1)
                .getOne();

            if (!latestCustomer) {
                return 'KH001';
            }
            const latestNumber = parseInt(latestCustomer.ma_kh.substring(2));
            if (isNaN(latestNumber)) {
                return 'KH001';
            }
            return 'KH' + (latestNumber + 1).toString().padStart(3, '0');

        } catch (error) {
            return 'KH001';
        }
    }

}