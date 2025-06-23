import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CategoryCustomerService } from './category_customer.service';

@ApiTags('category-customer')
@Controller('category-customer')
export class CategoryCustomerController {
    constructor(private readonly categoryCustomerService: CategoryCustomerService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo khách hàng mới' })
    @ApiResponse({ status: 201, description: 'Tạo thành công' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        const customer = await this.categoryCustomerService.create(createCustomerDto);
        return {
            status: HttpStatus.CREATED,
            message: 'Tạo khách hàng thành công',
            data: customer
        };
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách khách hàng' })
    @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
    async findAll(@Query() queryDto: QueryCustomerDto) {
        const result = await this.categoryCustomerService.findAll(queryDto);
        return {
            status: HttpStatus.OK,
            message: 'Lấy danh sách khách hàng thành công',
            ...result
        };
    }

    @Get(':ma_kh')
    @ApiOperation({ summary: 'Lấy thông tin khách hàng theo mã' })
    @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khách hàng' })
    async findOne(@Param('ma_kh') ma_kh: string) {
        const customer = await this.categoryCustomerService.findOne(ma_kh);
        return {
            status: HttpStatus.OK,
            message: 'Lấy thông tin khách hàng thành công',
            data: customer
        };
    }

    @Patch(':ma_kh')
    @ApiOperation({ summary: 'Cập nhật thông tin khách hàng' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khách hàng' })
    async update(@Param('ma_kh') ma_kh: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        const customer = await this.categoryCustomerService.update(ma_kh, updateCustomerDto);
        return {
            status: HttpStatus.OK,
            message: 'Cập nhật khách hàng thành công',
            data: customer
        };
    }

    @Delete(':ma_kh')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Xóa khách hàng' })
    @ApiResponse({ status: 204, description: 'Xóa thành công' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy khách hàng' })
    async remove(@Param('ma_kh') ma_kh: string) {
        await this.categoryCustomerService.remove(ma_kh);
        return {
            status: HttpStatus.NO_CONTENT,
            message: 'Xóa khách hàng thành công'
        };
    }
}