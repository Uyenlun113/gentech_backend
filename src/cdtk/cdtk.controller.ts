import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CdtkDto } from './cdtk.dto';
import { CdtkEntity } from './cdtk.entity';
import { CdtkService } from './cdtk.service';

@Controller('cdtk')
export class CdtkController {
    constructor(private readonly cdtkService: CdtkService) { }

    // ✅ Thêm mới
    @Post('bulk')
    async createBulk(@Body() data: CdtkDto[]): Promise<CdtkEntity[]> {
        return this.cdtkService.createBulk(data);
    }

    // ✅ Lấy danh sách theo năm
    @Get()
    async findByYear(@Query('nam') nam: number) {
        return this.cdtkService.findByYear(nam);
    }

    // ✅ Cập nhật theo tk và năm
    @Put()
    async update(
        @Query('tk') tk: string,
        @Query('nam') nam: number,
        @Body() data: CdtkDto,
    ) {
        return this.cdtkService.updateByTkAndYear(tk, nam, data);
    }

    // ✅ Lấy dữ liệu theo tk và năm
    @Get('one')
    async findOne(@Query('tk') tk: string, @Query('nam') nam: number) {
        return this.cdtkService.findOne(tk, nam);
    }
}
