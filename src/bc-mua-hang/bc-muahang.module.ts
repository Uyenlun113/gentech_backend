import { Module } from '@nestjs/common';
import { BcMuaHangController } from './bc-muahang.controller';
import { BcMuaHangService } from './bc-muahang.service';

@Module({
  controllers: [BcMuaHangController],
  providers: [BcMuaHangService],
})
export class BaocaoMuaHangModule {}
