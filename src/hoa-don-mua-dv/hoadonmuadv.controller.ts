import { Controller, Post, Put, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { HoaDonMuaDVService } from './hoadonmuadv.service';
import { CreateHoaDonMuaDVDto } from './dto/create-hoadonmuadv.dto';
import { UpdateHoaDonMuaDVDto } from './dto/update-hoadonmuadv.dto';

@Controller('hoadonmuadv')
export class HoaDonMuaDVController {
  constructor(private readonly HoaDonMuaDVService: HoaDonMuaDVService) {}


  @Post()
  async create(@Body() dto: CreateHoaDonMuaDVDto) {
    return this.HoaDonMuaDVService.create(dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.HoaDonMuaDVService.findAll(query);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() dto: UpdateHoaDonMuaDVDto) {
    return this.HoaDonMuaDVService.update(stt_rec, dto);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    return this.HoaDonMuaDVService.remove(stt_rec);
  }
}
