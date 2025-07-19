import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CdtkController } from "./cdtk.controller";
import { CdtkEntity } from "./cdtk.entity";
import { CdtkService } from "./cdtk.service";


@Module({
    imports: [TypeOrmModule.forFeature([CdtkEntity])],
    controllers: [CdtkController],
    providers: [CdtkService],
    exports: [CdtkService],
})

export class CdtkModule { }