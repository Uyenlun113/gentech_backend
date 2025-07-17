import { Controller, Post, Put, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { GiayBaoNoService } from './giaybaono.service';
import { CreateGiayBaoNoDto } from './dto/create-giaybaono.dto';
import { UpdateGiayBaoNoDto } from './dto/update-giaybaono.dto';

@Controller('giaybaono')
export class GiayBaoNoController {
  constructor(private readonly GiayBaoNoService: GiayBaoNoService) {}


  @Post()
  async create(@Body() dto: CreateGiayBaoNoDto) {
    return this.GiayBaoNoService.create(dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.GiayBaoNoService.findAll(query);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() dto: UpdateGiayBaoNoDto) {
    return this.GiayBaoNoService.update(stt_rec, dto);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    return this.GiayBaoNoService.remove(stt_rec);
  }
}
