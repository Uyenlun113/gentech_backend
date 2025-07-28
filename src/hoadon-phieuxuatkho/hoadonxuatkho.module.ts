import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoaDonXuatKhoService } from './hoadonxuatkho.service';
import { HoaDonXuatKhoController } from './hoadonxuatkho.controller';
import { Ct81 } from './entity/ct81.entity';
import { Ph81 } from './entity/ph81.entity';
import { Ct70 } from './entity/ct70.entity';
import { Ctgt20 } from './entity/ctgt20.entity';
import { Ct00 } from '../gb-co-nganhang/entity/ct00.entity';
// import { Ct81gt } from './entity/ct81gt.entity';
import { Customer } from '../category-customer/customer.entity'
import { Material } from '../material/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ct81, Ph81, Ct00, Customer, Material, Ct70, Ctgt20])],
  providers: [HoaDonXuatKhoService],
  controllers: [HoaDonXuatKhoController],
  exports: [HoaDonXuatKhoService],
})
export class HoaDonXuatKhoModule { }
