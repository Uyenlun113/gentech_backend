import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DonhangmuaService } from './donhangmua.service';
import { CreateDonHangMuaDto } from './dto/create-donhangmua.dto';
import { UpdateDonhangmuaDto } from './dto/update-donhangmua.dto';

@Controller('donhangmua')
export class DonhangmuaController {
    constructor(private readonly service: DonhangmuaService) { }

    @Post()
    create(@Body() dto: CreateDonHangMuaDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.service.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.getOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDonhangmuaDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}