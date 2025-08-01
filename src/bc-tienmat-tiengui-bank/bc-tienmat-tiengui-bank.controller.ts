import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { BcTienmatTienguiBankService } from './bc-tienmat-tiengui-bank.service';
import { CallStoreDto } from './dto/call-store.dto';

@Controller('baocaovonbangtien')
export class BcTienmatTienguiBankController {
  constructor(private readonly service: BcTienmatTienguiBankService) { }

  @Get('tiengui')
  async callStore(@Query() dto: CallStoreDto) {
    return this.service.callStore(dto);
  }
}
