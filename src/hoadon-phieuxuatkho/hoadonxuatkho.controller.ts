import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { fullDto } from './dto/create-hoadonxuatkho.dto';
import { HoaDonXuatKhoService } from './hoadonxuatkho.service';

@Controller('hoadonxuatkho')
export class HoaDonXuatKhoController {
  constructor(private readonly HoaDonXuatKhoService: HoaDonXuatKhoService) { }


  @Post()
  async create(@Body() dto: fullDto) {
    return this.HoaDonXuatKhoService.create(dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.HoaDonXuatKhoService.findAll(query);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() dto: fullDto) {
    return this.HoaDonXuatKhoService.update(stt_rec, dto);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    return this.HoaDonXuatKhoService.remove(stt_rec);
  }
}
