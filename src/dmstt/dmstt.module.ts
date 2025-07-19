import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DmsttController } from "./dmstt.controller";
import { DmsttEntity } from "./dmstt.entity";
import { DmsttService } from "./dmstt.service";

@Module({
    imports: [TypeOrmModule.forFeature([DmsttEntity])],
    controllers: [DmsttController],
    providers: [DmsttService],
    exports: [DmsttService],
})

export class DmsttModule { }