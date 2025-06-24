import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GeneralAccountingService } from './general-accounting.service';
import { SaveGeneralAccountingDto } from './save-general-accounting.dto';

@Controller('general-accounting')
export class GeneralAccountingController {
    constructor(private readonly generalAccountingService: GeneralAccountingService) { }

    @Post()
    async save(@Body() body: SaveGeneralAccountingDto) {
        return this.generalAccountingService.save(body);
    }

    @Get('ph11')
    async getPh11(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search: string,
    ) {
        const data = await this.generalAccountingService.findAllPh11({
            page: Number(page),
            limit: Number(limit),
            search,
        });

        return {
            status: 200,
            message: 'Danh sách phiếu',
            ...data, // total, items
        };
    }

    @Get('ct11/:stt_rec')
    async getCt11(@Param('stt_rec') stt_rec: string) {
        const data = await this.generalAccountingService.findAllCt11(stt_rec);
        return {
            status: 200,
            message: 'Danh sách chi tiết',
            data,
        };
    }
}
