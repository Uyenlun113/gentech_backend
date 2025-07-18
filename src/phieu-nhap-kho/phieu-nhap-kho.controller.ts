import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { PhieuNhapKhoService } from './phieu-nhap-kho.service';
import { CreatePhieuNhapKhoDto } from './dto/create-phieunhapkho.dto';
import { UpdatePhieuNhapKhoDto } from './dto/update-phieunhapkho.dto';

@Controller('phieunhapkho')
export class PhieuNhapKhoController {
  constructor(private readonly phieuNhapKhoService: PhieuNhapKhoService) { }

  @Post()
  async create(@Body() body: CreatePhieuNhapKhoDto) {
    return this.phieuNhapKhoService.create(body);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.phieuNhapKhoService.findAll(query);
  }

  @Get(':stt_rec')
  async findOne(@Param('stt_rec') stt_rec: string) {
    return this.phieuNhapKhoService.findOne(stt_rec);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() body: UpdatePhieuNhapKhoDto) {
    return this.phieuNhapKhoService.update(stt_rec, body);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    await this.phieuNhapKhoService.remove(stt_rec);
    return { deleted: true };
  }
}