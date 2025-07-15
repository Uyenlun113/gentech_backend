import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SaveCt46AccountingDto } from './phieu-chi.dto';
import { Ct46AccountingService } from './phieu-chi.service';


@Controller('phieu-chi')
export class Ct46AccountingController {
    constructor(private readonly ct46AccountingService: Ct46AccountingService) { }

    @Post()
    async create(@Body() dto: SaveCt46AccountingDto) {
        return await this.ct46AccountingService.save(dto);
    }

    @Put(':stt_rec')
    async update(@Param('stt_rec') stt_rec: string, @Body() dto: SaveCt46AccountingDto) {
        return await this.ct46AccountingService.update(stt_rec, dto);
    }

    @Delete(':stt_rec')
    async delete(@Param('stt_rec') stt_rec: string) {
        return await this.ct46AccountingService.delete(stt_rec);
    }

    @Get(':stt_rec')
    async findOne(@Param('stt_rec') stt_rec: string) {
        return await this.ct46AccountingService.findOne(stt_rec);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string
    ) {
        return await this.ct46AccountingService.findAllPh46({ page, limit, search });
    }

    @Get('ct46/:stt_rec')
    async findAllCt46(@Param('stt_rec') stt_rec: string) {
        return await this.ct46AccountingService.findAllCt46(stt_rec);
    }
}