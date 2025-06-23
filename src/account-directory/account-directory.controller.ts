import { Controller, Get } from "@nestjs/common";
import { AccountDirectoryService } from "./account-directory.service";
import { QueryAccountDto } from "./dto/query-account.dto";
@Controller('account-directory')
export class AccountDirectoryController {
    constructor(private readonly accountDirectoryService: AccountDirectoryService) { }
    @Get('')
    async findAll(query: QueryAccountDto) {
        return this.accountDirectoryService.findAll(query);
    }
}