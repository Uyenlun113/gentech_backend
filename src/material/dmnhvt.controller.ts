import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { dmnhvtService } from "./dmnhvt.service";
import { CreateDmnhvtDto } from "./dto/create-dmnhvt.dto";
import { QueryMaterialDto } from "./dto/query-material.dto";

@Controller('dmnhvt')
export class dmnhvtController {
    constructor(private readonly dmnhvtService: dmnhvtService) { }

    @Post('create')
    async create(@Body() createDmnhvtDto: CreateDmnhvtDto) {
        return await this.dmnhvtService.create(createDmnhvtDto);
    }

    @Get()
    async findAll(@Query() queryMaterialDto: QueryMaterialDto) {
        return await this.dmnhvtService.findAll(queryMaterialDto);
    }

    @Get(':loai_nh/:ma_nh')
    async findOne(@Param('loai_nh') loai_nh: number, @Param('ma_nh') ma_nh: string) {
        return await this.dmnhvtService.findOne(loai_nh, ma_nh);
    }

    @Patch('update/:loai_nh/:ma_nh')
    async update(
        @Param('loai_nh') loai_nh: number,
        @Param('ma_nh') ma_nh: string,
        @Body() updateDmnhvtDto: CreateDmnhvtDto
    ) {
        return await this.dmnhvtService.update(loai_nh, ma_nh, updateDmnhvtDto);
    }

    @Delete('delete/:loai_nh/:ma_nh')
    async delete(@Param('loai_nh') loai_nh: number, @Param('ma_nh') ma_nh: string) {
        return await this.dmnhvtService.delete(loai_nh, ma_nh);
    }
}
