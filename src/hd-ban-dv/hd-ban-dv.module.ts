import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ct21Entity } from "./entity/ct21.entity";
import { Ph21Entity } from "./entity/ph21.entity";
import { HdBanDvController } from "./hd-ban-dv.controller";
import { HdBanDvService } from "./hd-ban-dv.service";



@Module({
    imports: [TypeOrmModule.forFeature([Ph21Entity, Ct21Entity])],
    controllers: [HdBanDvController],
    providers: [HdBanDvService],
    exports: [HdBanDvService],
})

export class HdBanDvModule { }