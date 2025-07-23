import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateFullPh71Dto } from "./dto/create-full.dto";
import { phieuMuaService } from "./phieu-mua.service";

@Controller('phieu-mua')
export class phieuMuaController {
    constructor(private readonly phieuMuaService: phieuMuaService) { }

    @Post()
    async createPhieu(@Body() createPhieuDto: CreateFullPh71Dto) {
        return this.phieuMuaService.createFullPhieu(createPhieuDto);
    }

    @Patch('/update/:stt_rec')
    async updatePhieu(@Body() updatePhieuDto: CreateFullPh71Dto, @Param('stt_rec') stt_rec: string) {
        return this.phieuMuaService.updateFullPhieu(stt_rec, updatePhieuDto);
    }

    @Get()
    async getAllPhieu(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search = '',
    ) {
        return this.phieuMuaService.getAllPh71(+page, +limit, search);
    }

    @Get(':stt_rec')
    async getPhieuById(@Param('stt_rec') stt_rec: string) {
        return this.phieuMuaService.getPh71ById(stt_rec);
    }

    @Delete(':stt_rec')
    async deletePhieu(@Param('stt_rec') stt_rec: string) {
        return this.phieuMuaService.deletePh71(stt_rec);
    }


}