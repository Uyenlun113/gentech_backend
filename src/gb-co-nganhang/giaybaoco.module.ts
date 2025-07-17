import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiayBaoCoService } from './giaybaoco.service';
import { GiayBaoCoController } from './giaybaoco.controller';
import { Ct51 } from './entity/ct51.entity';
import { Ph51 } from './entity/ph51.entity';
import { Ct00 } from './entity/ct00.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ct51, Ph51, Ct00])],
  providers: [GiayBaoCoService],
  controllers: [GiayBaoCoController],
  exports: [GiayBaoCoService],
})
export class GiayBaoCoModule {}
