import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { DmkhoService } from "./dmkho.service";
import { CreateDmkhoDto } from "./dto/create-dmkho.dto";
import { QueryDmkhoDto } from "./dto/query.dto";

@Controller('dmkho')
export class DmkhoController {
    constructor(private readonly dmkhoService: DmkhoService) { }

    @Get()
    findAll(@Query() query: QueryDmkhoDto) {
        return this.dmkhoService.findAll(query);
    }

    @Post()
    create(@Body() createDmkhoDto: CreateDmkhoDto) {
        return this.dmkhoService.create(createDmkhoDto);
    }

    @Get(':ma_kho')
    findOne(@Query() query: QueryDmkhoDto, @Param('ma_kho') ma_kho: string) {
        return this.dmkhoService.findOne(ma_kho);
    }

    @Patch('update/:ma_kho')
    update(@Body() updateDmkhoDto: CreateDmkhoDto, @Param('ma_kho') ma_kho: string) {
        return this.dmkhoService.update(ma_kho, updateDmkhoDto);
    }

    @Delete('delete/:ma_kho')
    delete(@Param('ma_kho') ma_kho: string) {
        return this.dmkhoService.delete(ma_kho);
    }
}