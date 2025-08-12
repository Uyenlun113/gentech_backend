import { Module } from '@nestjs/common';
import { BcTonKhoController } from './bc-tonkho.controller';
import { BcTonKhoService } from './bc-tonkho.service';

@Module({
  controllers: [BcTonKhoController],
  providers: [BcTonKhoService],
})
export class BaocaoTonKhoModule {}
