import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dmvuviec } from './entity/dmvuviec.entity';
import { DmvuviecService } from './dmvuviec.service';
import { DmvuviecController } from './dmvuviec.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dmvuviec])],
  providers: [DmvuviecService],
  controllers: [DmvuviecController],
  exports: [DmvuviecService],
})
export class DmvuviecModule {}
