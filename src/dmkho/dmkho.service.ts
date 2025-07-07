import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Dmkho } from "./dmkho.entity";
import { CreateDmkhoDto } from "./dto/create-dmkho.dto";
import { QueryDmkhoDto } from "./dto/query.dto";

export class DmkhoService {
    constructor(
        @InjectRepository(Dmkho)
        private readonly dmkhoRepository: Repository<Dmkho>,
        private readonly dataSource: DataSource
    ) { }

    async findAll(query: QueryDmkhoDto) {
        try {
            const { search, page = 1, limit = 10 } = query;
            const queryBuilder = this.dmkhoRepository.createQueryBuilder('dmkho');
            if (search) {
                queryBuilder.where(
                    '(dmkho.ma_kho LIKE :search OR dmkho.ten_kho LIKE :search)',
                    { search: `%${search}%` }
                );
            }
            const [res, total] = await queryBuilder
                .orderBy('dmkho.ma_kho', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                message: 'Lấy danh sách kho',
                data: res,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách kho: ${error.message}`);
        }

    }

    async findOne(ma_kho: string) {
        try {
            const res = await this.dmkhoRepository.findOne({ where: { ma_kho } });
            if (!res) {
                throw new BadRequestException(`Không tìm thấy bản ghi với ma_kho=${ma_kho}`);
            }
            return {
                message: 'Lấy kho',
                data: res
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy kho: ${error.message}`);
        }
    }

    async create(createDmkhoDto: CreateDmkhoDto) {
        try {
            const newData = this.dmkhoRepository.create(createDmkhoDto);
            const res = await this.dmkhoRepository.save(newData);
            return {
                message: 'Thêm danh mục kho thành công',
                data: res
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi them kho: ${error.message}`);
        }
    }

    async update(ma_kho: string, updateDmkhoDto: CreateDmkhoDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const oldKho = await this.dmkhoRepository.findOne({ where: { ma_kho } });
            if (!oldKho) {
                throw new BadRequestException(`Không tìm thấy bản ghi với ma_kho=${ma_kho}`);
            }

            const newMaKho = updateDmkhoDto.ma_kho || ma_kho;

            // Gọi stored procedure CheckStringContainDM với sp_executesql
            await queryRunner.query(
                `
                EXEC sp_executesql 
                    N'EXEC dbo.CheckStringContainDM @TableName, @TableKey, @Value_new, @Value_old',
                    N'@TableName NVARCHAR(50), @TableKey NVARCHAR(50), @Value_new NVARCHAR(50), @Value_old NVARCHAR(50)',
                    @TableName = @0, 
                    @TableKey = @1, 
                    @Value_new = @2, 
                    @Value_old = @3
                `,
                ['dmkho', 'ma_kho', newMaKho, ma_kho]
            );

            // Gọi stored procedure CheckExistListId với sp_executesql
            await queryRunner.query(
                `
                EXEC sp_executesql 
                    N'EXEC dbo.CheckExistListId @ma_dm, @ma_kho',
                    N'@ma_dm NVARCHAR(50), @ma_kho NVARCHAR(50)',
                    @ma_dm = @0, 
                    @ma_kho = @1
                `,
                ['dmkho', newMaKho]
            );

            // Cập nhật
            const result = await this.dmkhoRepository.update({ ma_kho }, {
                ...updateDmkhoDto,
                ma_kho: newMaKho
            });
            if (result.affected === 0) {
                throw new BadRequestException(`Không tìm thấy bản ghi với ma_kho=${ma_kho}`);
            }

            return {
                message: 'Cập nhật danh mục kho thành công',
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi cập nhật kho: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(ma_kho: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(
                `
                EXEC sp_executesql 
                    N'EXEC dbo.CheckDeleteListId @ma_dm, @ma_kho',
                    N'@ma_dm NVARCHAR(50), @ma_kho NVARCHAR(50)',
                    @ma_dm = @0, 
                    @ma_kho = @1
                `,
                ['dmkho', ma_kho]
            );

            const result = await this.dmkhoRepository.delete({ ma_kho });
            if (result.affected === 0) {
                throw new BadRequestException(`Không tìm thấy kho với mã: ${ma_kho}`);
            }

            return {
                message: 'Xóa kho thành công',
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi xóa kho: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }


}