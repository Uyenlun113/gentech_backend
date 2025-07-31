import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ct00Entity } from "src/general-accounting/entity/ct00.entity";
import { ChiPhiMuaHangController } from "./chi-phi-mua-hang.controller";
import { ChiPhiMuaHangService } from "./chi-phi-mua-hang.service";
import { Ct73Entity } from "./entity/ct73.entity";
import { Ct73GtEntity } from "./entity/ct73gt.entity";
import { Ph73Entity } from "./entity/ph73.entity";
import { Material } from '../material/material.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Ct73Entity, Ct73GtEntity, Ph73Entity, Ct00Entity, Material])],
    controllers: [ChiPhiMuaHangController],
    providers: [ChiPhiMuaHangService],
    exports: [ChiPhiMuaHangService],
})

export class chiPhiMuaHangModule { }