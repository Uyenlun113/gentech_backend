import { Module } from '@nestjs/common';
import { BcTienmatTienguiBankController } from './bc-tienmat-tiengui-bank.controller';
import { BcTienmatTienguiBankService } from './bc-tienmat-tiengui-bank.service';

@Module({
  controllers: [BcTienmatTienguiBankController],
  providers: [BcTienmatTienguiBankService],
})
export class BaocaovonbangtienModule {}
