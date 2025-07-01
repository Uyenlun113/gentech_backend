import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';

@Controller('materials')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Post()
    create(@Body() createMaterialDto: CreateMaterialDto) {
        return this.materialService.create(createMaterialDto);
    }

    @Get()
    findAll(@Query() query: QueryMaterialDto) {
        return this.materialService.findAll(query);
    }

    @Get('by-part-no/:part_no')
    findByPartNo(@Param('part_no') part_no: string) {
        return this.materialService.findByPartNo(part_no);
    }

    @Get(':ma_vt')
    findOne(@Param('ma_vt') ma_vt: string) {
        return this.materialService.findOne(ma_vt);
    }

    @Patch(':ma_vt')
    update(@Param('ma_vt') ma_vt: string, @Body() updateMaterialDto: UpdateMaterialDto) {
        return this.materialService.update(ma_vt, updateMaterialDto);
    }

    @Delete(':ma_vt')
    remove(@Param('ma_vt') ma_vt: string) {
        return this.materialService.remove(ma_vt);
    }
}