import { Body, Controller, Post } from '@nestjs/common';
import { BcTienmatTienguiBankService } from './bc-tienmat-tiengui-bank.service';
import { CallStoreDto } from './dto/call-store.dto';

@Controller('baocaovonbangtien')
export class BcTienmatTienguiBankController {
  constructor(private readonly service: BcTienmatTienguiBankService) {}

  @Post('tiengui')
  async callStore(@Body() dto: CallStoreDto) {
    return this.service.callStore(dto);
  }
}
