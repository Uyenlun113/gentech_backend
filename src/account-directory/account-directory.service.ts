import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccountDirectory } from "./account-directory.entity";
import { QueryAccountDto } from "./dto/query-account.dto";
import { HttpStatus } from "@nestjs/common";

export class AccountDirectoryService {
    constructor(
        @InjectRepository(AccountDirectory)
        private accountDirectoryRepository: Repository<AccountDirectory>,
    ) { }

    async findAll(query: QueryAccountDto = {} as QueryAccountDto) {
        const { search } = query;
        const qb = this.accountDirectoryRepository.createQueryBuilder('dmtk');

        if (search) {
            qb.andWhere('dmtk.tk LIKE :search', { search: `%${search}%` });
        }
        const result = await qb.getMany();
        return {
            status: HttpStatus.OK,
            message: 'Danh sách tài khoản',
            data: result,
        };
    }

}
