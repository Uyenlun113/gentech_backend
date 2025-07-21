import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PhieuXuatKhoService } from './phieu-xuat-kho.service';
import { CreatePhieuXuatKhoDto } from './dto/create-phieuxuatkho.dto';
import { UpdatePhieuXuatKhoDto } from './dto/update-phieuxuatkho.dto';

@Controller('phieuxuatkho')
export class PhieuXuatKhoController {
  constructor(private readonly phieuXuatKhoService: PhieuXuatKhoService) { }

  @Post()
  async create(@Body() body: CreatePhieuXuatKhoDto) {
    return this.phieuXuatKhoService.create(body);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.phieuXuatKhoService.findAll(query);
  }

  @Get(':stt_rec')
  async findOne(@Param('stt_rec') stt_rec: string) {
    return this.phieuXuatKhoService.findOne(stt_rec);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() body: UpdatePhieuXuatKhoDto) {
    return this.phieuXuatKhoService.update(stt_rec, body);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    await this.phieuXuatKhoService.remove(stt_rec);
    return { deleted: true };
  }
}