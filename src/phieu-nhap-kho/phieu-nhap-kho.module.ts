import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ct74 } from './entity/ct74.entity';
import { Ph74 } from './entity/ph74.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity';
import { PhieuNhapKhoService } from './phieu-nhap-kho.service';
import { PhieuNhapKhoController } from './phieu-nhap-kho.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ct74, Ph74, Ct00])],
  providers: [PhieuNhapKhoService],
  controllers: [PhieuNhapKhoController],
  exports: [PhieuNhapKhoService],
})
export class PhieuNhapKhoModule { }