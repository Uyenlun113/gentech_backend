import { Controller, Post, Put, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { GiayBaoCoService } from './giaybaoco.service';
import { CreateGiayBaoCoDto } from './dto/create-giaybaoco.dto';
import { UpdateGiayBaoCoDto } from './dto/update-giaybaoco.dto';

@Controller('giaybaoco')
export class GiayBaoCoController {
  constructor(private readonly GiayBaoCoService: GiayBaoCoService) {}


  @Post()
  async create(@Body() dto: CreateGiayBaoCoDto) {
    return this.GiayBaoCoService.create(dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.GiayBaoCoService.findAll(query);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() dto: UpdateGiayBaoCoDto) {
    return this.GiayBaoCoService.update(stt_rec, dto);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    return this.GiayBaoCoService.remove(stt_rec);
  }
}
