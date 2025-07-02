import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AccountDirectory } from './account-directory.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountDirectoryService {
    constructor(
        @InjectRepository(AccountDirectory)
        private accountDirectoryRepository: Repository<AccountDirectory>,
        private dataSource: DataSource
    ) { }

    // Danh sách tài khoản
    async findAll(queryDto: QueryAccountDto) {
        const { page = 1, limit = 10, search, loai_tk, tk_me } = queryDto;
        try {
            const queryBuilder = this.accountDirectoryRepository.createQueryBuilder('dmtk');
            if (search) {
                queryBuilder.where(
                    '(dmtk.tk LIKE :search OR dmtk.ten_tk LIKE :search)',
                    { search: `%${search}%` }
                );
            }
            if (loai_tk) {
                if (search) {
                    queryBuilder.andWhere('dmtk.loai_tk = :loai_tk', { loai_tk });
                } else {
                    queryBuilder.where('dmtk.loai_tk = :loai_tk', { loai_tk });
                }
            }
            if (tk_me) {
                queryBuilder.andWhere('dmtk.tk_me = :tk_me', { tk_me });
            }
            const [data, total] = await queryBuilder
                .orderBy('dmtk.tk', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                status: HttpStatus.OK,
                message: 'Danh sách tài khoản',
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
                where: { tk: dto.tk }
            });
            if (existingAccount) {
                throw new BadRequestException('Mã tài khoản đã tồn tại');
            }
            await this.dataSource.query(
                `EXEC CheckStringContainDM @table_name = @0, @table_key = @1, @new_value = @2, @old_value = @3`,
                ['dmtk', 'tk', dto.tk, '']
            );
            const account = this.accountDirectoryRepository.create({
                tk: dto.tk,
                ten_tk: dto.ten_tk,
                tk_me: dto.tk_me,
                ma_nt: dto.ma_nt,
                loai_tk: dto.loai_tk,
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
    async update(tk: string, dto: UpdateAccountDto) {
        try {
            const existingAccount = await this.findOne(tk);
            await this.dataSource.query(
                `EXEC CheckStringContainDM @table_name = @0, @table_key = @1, @new_value = @2, @old_value = @3`,
                ['dmtk', 'tk', tk, tk]
            );
            Object.assign(existingAccount, dto);
            const updatedAccount = await this.accountDirectoryRepository.save(existingAccount);
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
    async remove(tk: string) {
        try {
            const account = await this.findOne(tk);
            const checkResult = await this.dataSource.query(
                `EXEC CheckDeleteListId @ma_dm = @0, @value = @1`,
                ['dmtk', tk]
            );
            if (checkResult && checkResult[0] && checkResult[0][''] === 0) {
                throw new BadRequestException('Không thể xóa tài khoản này vì đang được sử dụng trong các chứng từ khác');
            }
            await this.accountDirectoryRepository.remove(account);
            return {
                status: HttpStatus.OK,
                message: 'Xóa tài khoản thành công',
                tk
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi xóa tài khoản: ${error.message}`);
        }
    }

    // Lấy thông tin chi tiết tài khoản theo mã
    async findOne(tk: string): Promise<AccountDirectory> {
        try {
            const account = await this.accountDirectoryRepository.findOne({
                where: { tk }
            });
            if (!account) {
                throw new NotFoundException(`Không tìm thấy tài khoản với mã: ${tk}`);
            }
            return account;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi tìm tài khoản: ${error.message}`);
        }
    }
}