import { Body, Controller, Post } from '@nestjs/common';
import { BcMuaHangService } from './bc-muahang.service';

@Controller('baocaomuahang')
export class BcMuaHangController {
  constructor(private readonly service: BcMuaHangService) { }

  @Post('muahang')
  async callStore(@Body() dto: any) {
    return this.service.callStore(dto);
  }
}
