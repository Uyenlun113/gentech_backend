import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { BcTonKhoService } from './bc-tonkho.service';

@Controller('baocaotonkho')
export class BcTonKhoController {
  constructor(private readonly service: BcTonKhoService) { }

  @Post('tonkho')
  async callStore(@Body() dto: any) {
    return this.service.callStore(dto);
  }
}
