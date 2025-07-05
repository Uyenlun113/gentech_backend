import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CustomerGroup } from "./customer-group.entity";
import { CreateCustomerGroupDto } from "./dto/create_customer-group";
import { QueryCustomerDto } from "./dto/query-customer.dto";

export class CustomerGroupService {
    constructor(
        @InjectRepository(CustomerGroup)
        private customerGroupRepository: Repository<CustomerGroup>,
        private dataSource: DataSource
    ) { }
    async findAll(queryCustomerDto: QueryCustomerDto) {
        try {
            const { page = 1, limit = 10, search } = queryCustomerDto;
            const queryBuilder = this.customerGroupRepository.createQueryBuilder('customerGroup');
            if (search) {
                queryBuilder.where(
                    '(customerGroup.ma_nh LIKE :search OR customerGroup.ten_nh LIKE :search)',
                    { search: `%${search}%` }
                );
            }
            const [result, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return {
                message: 'Lấy danh sách nhóm khách hàng thành công',
                data: result,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            }
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách nhóm khách hàng: ${error.message}`);
        }
    }
    async findOne(ma_nh: string , loai_nh: number) {
        try {
            const customerGroup = await this.customerGroupRepository.findOne({
                where: { ma_nh , loai_nh }
            });
            if (!customerGroup) {
                throw new BadRequestException(`Không tìm thấy nhóm khách hàng với má: ${ma_nh}`);
            }
            return customerGroup;
        } catch (error) {
            throw new BadRequestException(`Lỗi khi tìm nhóm khách hàng: ${error.message}`);
        }
    }

    async create(dto: CreateCustomerGroupDto) {
        try {
            const customerGroup = this.customerGroupRepository.create(dto);
            const savedCustomerGroup = await this.customerGroupRepository.save(customerGroup);
            return {
                message: 'Them nhom khach hang thanh cong',
                data: savedCustomerGroup
            };
        } catch (error) {
            throw new BadRequestException(`Loi khi them nhom khach hang: ${error.message}`);
        }
    }

    async update(ma_nh: string, loai_nh: number, dto: CreateCustomerGroupDto) {
        try {
            const savedCustomerGroup = await this.customerGroupRepository.update({ loai_nh, ma_nh: ma_nh.trim() }, dto);
            if (savedCustomerGroup.affected === 0) {
                            throw new NotFoundException(`Không tìm thấy bản ghi với loai_nh=${loai_nh} và ma_nh=${ma_nh}`);
                        }
            return {
                message: 'Cap nhat nhom khach hang thanh cong',
                data: savedCustomerGroup
            };
        } catch (error) {
            throw new BadRequestException(`Loi khi cap nhat nhom khach hang: ${error.message}`);
        }
    }

    async delete(ma_nh: string, loai_nh: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const result = await queryRunner.query(
                `SELECT COUNT(ma_kh) as total
             FROM dmkh 
             WHERE nh_kh1 = @0 AND ma_kh IN (SELECT ma_kh FROM ct00)`,
                [ma_nh.trim()]
            );
            if (result[0]?.total > 0) {
                throw new BadRequestException(
                    `Không thể xóa nhóm khách hàng vì đã có dữ liệu liên kết trong bảng ct00`
                );
            }
            const deleteResult = await this.customerGroupRepository.delete({ loai_nh, ma_nh: ma_nh.trim() });

            if (deleteResult.affected === 0) {
                throw new NotFoundException(`Không tìm thấy nhóm khách hàng với mã: ${ma_nh} và loại: ${loai_nh}`);
            }

            return {
                message: 'Xóa nhóm khách hàng thành công',
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi xóa nhóm khách hàng: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
      }
}