import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DonBanHangController } from "./don-ban-hang.controller";
import { DonBanHangService } from "./don-ban-hang.service";
import { DmhdEntity } from "./entity/dmhd.entity";
import { DmhdctEntity } from "./entity/dmhdct.entity";


@Module({
    imports: [TypeOrmModule.forFeature([DmhdEntity, DmhdctEntity])],
    controllers: [DonBanHangController],
    providers: [DonBanHangService],
    exports: [DonBanHangService],
})

export class DonBanHangModule { }