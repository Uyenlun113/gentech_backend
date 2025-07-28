import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateFullPh21Dto } from "./dto/create-full.dto";
import { HdBanDvService } from "./hd-ban-dv.service";

@Controller('hd-ban-dv')
export class HdBanDvController {
    constructor(private readonly hdBanDvService: HdBanDvService) { }

    @Post()
    async createOrUpdateFullPhieu(@Body() dto: CreateFullPh21Dto) {
        return this.hdBanDvService.createOrUpdateFullPhieu(dto);
    }

    @Get()
    async listHdBanDv(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
        return this.hdBanDvService.listHdBanDv(Number(page), Number(limit));
    }

    @Get(':stt_rec')
    async getHdBanDvBySttRec(@Param('stt_rec') stt_rec: string) {
        return this.hdBanDvService.getHdBanDvBySttRec(stt_rec);
    }

    @Patch('/:stt_rec')
    async updateHdBanDv(@Body() dto: CreateFullPh21Dto, @Param('stt_rec') stt_rec: string) {
        return this.hdBanDvService.updateHdBanDv(stt_rec, dto);
    }

    @Delete('/:stt_rec')
    async deleteHdBanDv(@Param('stt_rec') stt_rec: string) {
        return this.hdBanDvService.deleteHdBanDv(stt_rec);
    }

}