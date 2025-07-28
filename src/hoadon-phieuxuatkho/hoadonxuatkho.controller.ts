import { Controller, Post, Put, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { HoaDonXuatKhoService } from './hoadonxuatkho.service';
import { CreateHoaDonXuatKhoDto } from './dto/create-hoadonxuatkho.dto';
import { UpdateHoaDonXuatKhoDto } from './dto/update-hoadonxuatkho.dto';

@Controller('hoadonxuatkho')
export class HoaDonXuatKhoController {
  constructor(private readonly HoaDonXuatKhoService: HoaDonXuatKhoService) {}


  @Post()
  async create(@Body() dto: CreateHoaDonXuatKhoDto) {
    return this.HoaDonXuatKhoService.create(dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.HoaDonXuatKhoService.findAll(query);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() dto: UpdateHoaDonXuatKhoDto) {
    return this.HoaDonXuatKhoService.update(stt_rec, dto);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    return this.HoaDonXuatKhoService.remove(stt_rec);
  }
}
