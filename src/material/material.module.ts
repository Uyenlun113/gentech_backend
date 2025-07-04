import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dmnhvt } from './dmnhvt.entity';
import { dmnhvtService } from './dmnhvt.service';
import { MaterialController } from './material.controller';
import { Material } from './material.entity';
import { MaterialService } from './material.service';
import { dmnhvtController } from './dmnhvt.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Material, Dmnhvt])],
    controllers: [MaterialController, dmnhvtController],
    providers: [MaterialService, dmnhvtService],
    exports: [MaterialService]
})
export class MaterialModule { }