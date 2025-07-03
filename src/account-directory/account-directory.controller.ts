import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AccountDirectoryService } from './account-directory.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { QueryAccountDto } from './dto/query-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account-directory')
@UsePipes(new ValidationPipe({ transform: true }))
export class AccountDirectoryController {
    constructor(private readonly accountDirectoryService: AccountDirectoryService) { }

    // Lấy danh sách tài khoản
    @Get()
    async findAll(@Query() query: QueryAccountDto) {
        return this.accountDirectoryService.findAll(query);
    }

    // Lấy chi tiết tài khoản
    @Get(':tk0')
    async findOne(@Param('tk0') tk0: string) {
        return this.accountDirectoryService.findOne(tk0);
    }

    // Thêm mới tài khoản
    @Post()
    async create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountDirectoryService.create(createAccountDto);
    }

    // Cập nhật tài khoản
    @Patch(':tk0')
    async update(
        @Param('tk0') tk0: string,
        @Body() updateAccountDto: UpdateAccountDto
    ) {
        return this.accountDirectoryService.update(tk0, updateAccountDto);
    }

    // Xóa tài khoản
    @Delete(':tk0')
    async remove(@Param('tk0') tk0: string) {
        return this.accountDirectoryService.remove(tk0);
    }

    // Lấy danh sách tài khoản theo nhóm
    @Get('group/list')
    async findAllAcountGroup(@Query() query: QueryAccountDto) {
        return this.accountDirectoryService.findAllAcountGroup(query);
    }

}