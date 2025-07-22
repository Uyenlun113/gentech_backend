import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CdvtController } from "./cdvt.controller";
import { CdvtEntity } from "./cdvt.entity";
import { CdvtService } from "./cdvt.service";


@Module({
    imports: [TypeOrmModule.forFeature([CdvtEntity])],
    controllers: [CdvtController],
    providers: [CdvtService],
    exports: [CdvtService],
})

export class CdvtModule { }