import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { DonBanHangService } from "./don-ban-hang.service";
import { CreateFullPhieuDto } from "./dto/create-full-phieu.dto";

@Controller('don-ban-hang')
export class DonBanHangController {
    constructor(private readonly donBanHangService: DonBanHangService) { }

    @Post()
    async createOrUpdateFullPhieu(@Body() dto: CreateFullPhieuDto) {
        return this.donBanHangService.createOrUpdateFullPhieu(dto);
    }

    @Get()
    async listDonBanHang(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
        return this.donBanHangService.listDonBanHang(Number(page), Number(limit));
    }

    @Get(':stt_rec')
    async getDonBanHangBySttRec(@Param('stt_rec') stt_rec: string) {
        return this.donBanHangService.getDonBanHangBySttRec(stt_rec);
    }

    @Patch('/:stt_rec')
    async updateDonBanHang(@Body() dto: CreateFullPhieuDto, @Param('stt_rec') stt_rec: string) {
        return this.donBanHangService.updateDonBanHang(stt_rec, dto);
    }

    @Delete('/:stt_rec')
    async deletePhieu(@Param('stt_rec') stt_rec: string) {
        return this.donBanHangService.deletePhieu(stt_rec);
    }



}