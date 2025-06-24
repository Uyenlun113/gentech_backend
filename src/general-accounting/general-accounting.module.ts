import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ct00Entity } from './entity/ct00.entity';
import { Ct11Entity } from './entity/ct11.entity';
import { Ct11GtEntity } from './entity/ct11gt.entity';
import { Ph11Entity } from './entity/ph11.entity';
import { GeneralAccountingController } from './general-accounting.controller';
import { GeneralAccountingService } from './general-accounting.service';
@Module({
    imports: [TypeOrmModule.forFeature([Ct00Entity, Ct11Entity, Ct11GtEntity, Ph11Entity])],
    controllers: [GeneralAccountingController],
    providers: [GeneralAccountingService],
    exports: [GeneralAccountingService],
})
export class GeneralAccountingModule { }
