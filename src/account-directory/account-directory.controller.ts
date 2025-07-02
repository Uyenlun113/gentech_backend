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
    @Get(':tk')
    async findOne(@Param('tk') tk: string) {
        return this.accountDirectoryService.findOne(tk);
    }

    // Thêm mới tài khoản
    @Post()
    async create(@Body() createAccountDto: CreateAccountDto) {
        return this.accountDirectoryService.create(createAccountDto);
    }

    // Cập nhật tài khoản
    @Patch(':tk')
    async update(
        @Param('tk') tk: string,
        @Body() updateAccountDto: UpdateAccountDto
    ) {
        return this.accountDirectoryService.update(tk, updateAccountDto);
    }

    // Xóa tài khoản
    @Delete(':tk')
    async remove(@Param('tk') tk: string) {
        return this.accountDirectoryService.remove(tk);
    }

    // Lấy danh sách tài khoản theo nhóm
    @Get('group/list')
    async findAllAcountGroup(@Query() query: QueryAccountDto) {
        return this.accountDirectoryService.findAllAcountGroup(query);
    }

}