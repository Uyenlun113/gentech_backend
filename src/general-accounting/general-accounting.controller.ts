import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
            ...data, 
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

    @Get('find-one/:stt_rec')
    async findOne(@Param('stt_rec') stt_rec: string) {
        return this.generalAccountingService.findOne(stt_rec);
    }

    @Put('update/:stt_rec')
    async update(@Param('stt_rec') stt_rec: string, @Body() body: SaveGeneralAccountingDto) {
        return this.generalAccountingService.update(stt_rec, body);
    }

    @Delete('delete/:stt_rec')
    async delete(@Param('stt_rec') stt_rec: string) {
        return this.generalAccountingService.delete(stt_rec);
    }
}
