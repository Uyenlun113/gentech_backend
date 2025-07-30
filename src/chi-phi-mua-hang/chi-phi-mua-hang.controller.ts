
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ChiPhiMuaHangService } from "./chi-phi-mua-hang.service";
import { CreateFullPh73Dto } from "./dto/create-full.dto";


@Controller('chi-phi-mua-hang')
export class ChiPhiMuaHangController {
    constructor(private readonly chiPhiMuaHangService: ChiPhiMuaHangService) { }

    @Post()
    async createChiPhi(@Body() createPhieuDto: CreateFullPh73Dto) {
        return this.chiPhiMuaHangService.createFullPhieu(createPhieuDto);
    }

    @Patch(':stt_rec')
    async updateChiPhi(@Body() updatePhieuDto: CreateFullPh73Dto, @Param('stt_rec') stt_rec: string) {
        return this.chiPhiMuaHangService.updateFullPhieu(stt_rec, updatePhieuDto);
    }

    @Get()
    async getAllChiPhi(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search = '',
    ) {
        return this.chiPhiMuaHangService.getAllPh73(+page, +limit, search);
    }

    @Get(':stt_rec')
    async getChiPhiById(@Param('stt_rec') stt_rec: string) {
        return this.chiPhiMuaHangService.getPh73ById(stt_rec);
    }

    @Delete(':stt_rec')
    async deleteChiPhi(@Param('stt_rec') stt_rec: string) {
        return this.chiPhiMuaHangService.deletePh73(stt_rec);
    }
}
