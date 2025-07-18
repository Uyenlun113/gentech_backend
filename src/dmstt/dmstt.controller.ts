import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { DmsttService } from './dmstt.service';

@Controller('dmstt')
export class DmsttController {
    constructor(private readonly dmsttService: DmsttService) { }

    @Get()
    findAll() {
        return this.dmsttService.findAll();
    }

    @Patch(':stt_rec')
    updateNgayKy1(
        @Param('stt_rec', ParseIntPipe) stt_rec: number,
        @Body('ngay_ky1') ngay_ky1: string,
    ) {
        return this.dmsttService.updateNgayKy1(stt_rec, ngay_ky1);
    }
}
