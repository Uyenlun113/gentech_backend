import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiayBaoNoService } from './giaybaono.service';
import { GiayBaoNoController } from './giaybaono.controller';
import { Ct56 } from './entity/ct56.entity';
import { Ph56 } from './entity/ph56.entity';
import { Ct00 } from './entity/ct00.entity';
import { Ct56gt } from './entity/ct56gt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ct56, Ph56, Ct00, Ct56gt])],
  providers: [GiayBaoNoService],
  controllers: [GiayBaoNoController],
  exports: [GiayBaoNoService],
})
export class GiayBaoNoModule { }
