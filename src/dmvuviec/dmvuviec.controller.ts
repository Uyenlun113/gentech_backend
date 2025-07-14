import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DmvuviecService } from './dmvuviec.service';
import { CreateDmvuviecDto } from './dto/create-dmvuviec.dto';
import { QueryDmvuviecDto } from './dto/query.dto';

@Controller('dmvuviec')
export class DmvuviecController {
  constructor(private readonly dmvuviecService: DmvuviecService) {}

  @Post()
  create(@Body() createDmvuviecDto: CreateDmvuviecDto) {
    return this.dmvuviecService.create(createDmvuviecDto);
  }

  @Get()
  findAll(@Query() query: QueryDmvuviecDto) {
    return this.dmvuviecService.findAll(query);
  }

  @Get(':ma_vv')
  findOne(@Param('ma_vv') ma_vv: string) {
    return this.dmvuviecService.findOne(ma_vv);
  }

  @Put(':ma_vv')
  update(@Param('ma_vv') ma_vv: string, @Body() updateDmvuviecDto: CreateDmvuviecDto) {
    return this.dmvuviecService.update(ma_vv, updateDmvuviecDto);
  }

  @Delete(':ma_vv')
  remove(@Param('ma_vv') ma_vv: string) {
    return this.dmvuviecService.remove(ma_vv);
  }
}
