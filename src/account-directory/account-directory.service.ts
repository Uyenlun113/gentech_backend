import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountDirectory } from './entity/account-directory.entity';
import { AccountGroup } from './entity/account-group.entity';

@Injectable()
export class AccountDirectoryService {
    constructor(
        @InjectRepository(AccountDirectory)
        private accountDirectoryRepository: Repository<AccountDirectory>,
        @InjectRepository(AccountGroup)
        private readonly accountGroupRepository: Repository<AccountGroup>,
        private dataSource: DataSource
    ) { }

    // Danh sách tài khoản
    async findAll(queryDto: QueryAccountDto) {
        const { page = 1, limit = 500, search, nh_tk, tk_me } = queryDto;
        try {
            const queryBuilder = this.accountDirectoryRepository.createQueryBuilder('dmtk');

            if (search) {
                queryBuilder.where(
                    '(dmtk.tk LIKE :search OR dmtk.ten_tk LIKE :search)',
                    { search: `%${search}%` }
                );
            }

            if (nh_tk) {
                if (search) {
                    queryBuilder.andWhere('dmtk.nh_tk = :nh_tk', { nh_tk });
                } else {
                    queryBuilder.where('dmtk.nh_tk = :nh_tk', { nh_tk });
                }
            }

            if (tk_me) {
                queryBuilder.andWhere('dmtk.tk_me = :tk_me', { tk_me });
            }

            queryBuilder.andWhere('(dmtk.tk_me IS NOT NULL AND dmtk.tk_me != \'\')');

            const [data, total] = await queryBuilder
                .skip((page - 1) * limit)
                .take(limit)
                .orderBy('dmtk.tk', 'ASC')
                .getManyAndCount();

            return {
                status: HttpStatus.OK,
                message: 'Danh sách tài khoản (loại bỏ tk mẹ)',
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách tài khoản: ${error.message}`);
        }
    }


    // Thêm mới tài khoản
    async create(dto: CreateAccountDto) {
        try {
            const existingAccount = await this.accountDirectoryRepository.findOne({
                where: { tk: dto.tk0 }
            });
            if (existingAccount) {
                throw new BadRequestException('Mã tài khoản đã tồn tại');
            }

            // Gọi CheckTKContain thay vì CheckStringContainDM
            await this.dataSource.query(
                `
                DECLARE @table_name CHAR(5) = @0, 
                        @new_value CHAR(5) = @1, 
                        @tk_me CHAR(8000) = @2, 
                        @old_value CHAR(8000) = @3;
                EXEC dbo.CheckTKContain @table_name, @new_value, @tk_me, @old_value;
                `,
                ['dmtk', dto.tk0, dto.tk_me || '', '']
            );

            const account = this.accountDirectoryRepository.create({
                tk: dto.tk0,
                tk0: dto.tk0,
                ten_tk: dto.ten_tk,
                tk_me: dto.tk_me,
                ma_nt: dto.ma_nt,
                nh_tk: dto.nh_tk,
                tk_sc: dto.tk_sc,
                tk_cn: dto.tk_cn
            });
            const savedAccount = await this.accountDirectoryRepository.save(account);

            return {
                status: HttpStatus.CREATED,
                message: 'Thêm tài khoản thành công',
                data: savedAccount
            };
        } catch (error) {
            if (error.message?.includes('trùng') || error.message?.includes('duplicate')) {
                throw new BadRequestException('Mã tài khoản đã tồn tại hoặc bị trùng lồng');
            }
            throw new BadRequestException(`Lỗi khi tạo tài khoản: ${error.message}`);
        }
    }

    // Cập nhật tài khoản
    async update(tk0: string, dto: UpdateAccountDto) {
        try {
            const existingAccount = await this.findOne(tk0);
            Object.assign(existingAccount, dto);
            const updatedAccount = await this.accountDirectoryRepository.save(existingAccount);
            await this.dataSource.query(
                `EXEC UpdateBacTk @0`,
                [updatedAccount.tk0]
            );
            return {
                status: HttpStatus.OK,
                message: 'Cập nhật tài khoản thành công',
                data: updatedAccount
            };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Lỗi khi cập nhật tài khoản: ${error.message}`);
        }
    }


    // Xóa tài khoản
    async remove(tk0: string) {
        try {
            const account = await this.findOne(tk0);
            const checkResult = await this.dataSource.query(
                `EXEC CheckDeleteListId @ma_dm = @0, @value = @1`,
                ['dmtk', tk0]
            );
            if (checkResult && checkResult[0] && checkResult[0][''] === 0) {
                throw new BadRequestException('Không thể xóa tài khoản này vì đang được sử dụng trong các chứng từ khác');
            }
            await this.accountDirectoryRepository.remove(account);
            return {
                status: HttpStatus.OK,
                message: 'Xóa tài khoản thành công',
                tk0
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi xóa tài khoản: ${error.message}`);
        }
    }

    // Lấy thông tin chi tiết tài khoản theo mã
    async findOne(tk0: string): Promise<AccountDirectory> {
        try {
            const account = await this.accountDirectoryRepository.findOne({
                where: { tk0 }
            });
            if (!account) {
                throw new NotFoundException(`Không tìm thấy tài khoản với mã: ${tk0}`);
            }
            return account;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi tìm tài khoản: ${error.message}`);
        }
    }

    async findAllAcountGroup(queryDto: QueryAccountDto) {
        const { page = 1, limit = 10, search } = queryDto;

        try {
            const queryBuilder = this.accountGroupRepository.createQueryBuilder('nhomtk');
            if (search) {
                queryBuilder.where(
                    '(nhomtk.ma_nh LIKE :search OR nhomtk.ten_nh LIKE :search)',
                    { search: `%${search}%` }
                );
            }
            const [data, total] = await queryBuilder
                .orderBy('nhomtk.ma_nh', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                status: HttpStatus.OK,
                message: 'Danh sách nhóm tài khoản',
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách nhóm tài khoản: ${error.message}`);
        }
    }
}