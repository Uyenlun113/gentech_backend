import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreatePh85Dto, CreatePh85DtoWithVatTu } from './dto/CreatePh85Dto';
import { Ph85Service } from './ph85.service';

@Controller('ph85')
export class Ph85Controller {
    constructor(private readonly ph85Service: Ph85Service) { }

    @Post()
    async create(@Body() dto: CreatePh85DtoWithVatTu) {
        return this.ph85Service.createPhieuXuat(dto);
    }

    @Patch('update/:stt_rec')
    async update(@Body() dto: CreatePh85DtoWithVatTu, @Param('stt_rec') stt_rec: string) {
        return this.ph85Service.updatePhieuXuat(dto, stt_rec);
    }

    @Get(':stt_rec')
    async findone(@Param('stt_rec') stt_rec: string) {
        return this.ph85Service.findById(stt_rec);
    }

    @Get()
    async findAll(@Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search?: string) {
        return this.ph85Service.findAll({ page, limit, search });
    }

    @Delete('delete/:stt_rec')
    async delete(@Param('stt_rec') stt_rec: string) {
        return this.ph85Service.deletePhieuXuat(stt_rec);
    }

    @Get('ct85/:stt_rec')
    async findAllCt85(@Param('stt_rec') stt_rec: string) {
        return this.ph85Service.getCt85BySttRec(stt_rec);
    }
}
