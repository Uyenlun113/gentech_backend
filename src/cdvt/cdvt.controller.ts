import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Body,
} from '@nestjs/common';
import { CreateCdvtDto } from './cdvt.dto';
import { CdvtService } from './cdvt.service';

@Controller('cdvt')
export class CdvtController {
    constructor(private readonly cdvtService: CdvtService) { }

    @Post()
    async createCdvt(@Body() createCdvtDto: CreateCdvtDto) {
        return await this.cdvtService.createCdvt(createCdvtDto);
    }

    @Get('findById')
    async findById(
        @Query('ma_vt') ma_vt: string,
        @Query('ma_kho') ma_kho: string,
        @Query('nam') nam: number,
    ) {
        return await this.cdvtService.findById(ma_vt, ma_kho, +nam);
    }

    @Patch('update/:ma_vt/:ma_kho/:nam')
    async updateCdvt(
        @Param('ma_vt') ma_vt: string,
        @Param('ma_kho') ma_kho: string,
        @Param('nam') nam: number,
        @Body() updateCdvtDto: CreateCdvtDto,
    ) {
        return await this.cdvtService.updateCdvt(ma_vt, ma_kho, +nam, updateCdvtDto);
    }

    @Delete('delete/:ma_vt/:ma_kho/:nam')
    async deleteCdvt(
        @Param('ma_vt') ma_vt: string,
        @Param('ma_kho') ma_kho: string,
        @Param('nam') nam: number,
    ): Promise<void> {
        return await this.cdvtService.deleteCdvt(ma_vt, ma_kho, +nam);
    }

    @Get()
    async findByMaKhoAndNam(
        @Query('ma_kho') maKho: string,
        @Query('nam') nam: number,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return await this.cdvtService.findByMaKhoAndNam(maKho, +nam, +page, +limit);
    }
}
  