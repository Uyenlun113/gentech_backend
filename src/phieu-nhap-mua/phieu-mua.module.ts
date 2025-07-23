import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ct00Entity } from "src/general-accounting/entity/ct00.entity";
import { Ct71Entity } from "./entity/ct71.entity";
import { Ct71GtEntity } from "./entity/ct71gt.entity";
import { Ph71Entity } from "./entity/ph71.entity";
import { phieuMuaController } from "./phieu-mua.controller";
import { phieuMuaService } from "./phieu-mua.service";

@Module({
    imports: [TypeOrmModule.forFeature([Ct71Entity, Ct71GtEntity, Ph71Entity, Ct00Entity])],
    controllers: [phieuMuaController],
    providers: [phieuMuaService],
    exports: [phieuMuaService],
})

export class phieuMuaModule { }