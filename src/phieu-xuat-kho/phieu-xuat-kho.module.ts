import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ct84 } from './entity/ct84.entity';
import { Ph84 } from './entity/ph84.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity';
import { PhieuXuatKhoService } from './phieu-xuat-kho.service';
import { PhieuXuatKhoController } from './phieu-xuat-kho.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ct84, Ph84, Ct00])],
  providers: [PhieuXuatKhoService],
  controllers: [PhieuXuatKhoController],
  exports: [PhieuXuatKhoService],
})
export class PhieuXuatKhoModule { }