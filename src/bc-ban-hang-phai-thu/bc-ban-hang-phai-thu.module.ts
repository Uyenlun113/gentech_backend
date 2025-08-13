import { Module } from '@nestjs/common';
import { BcBanHangPhaiThuController } from './bc-ban-hang-phai-thu.controller';
import { BcBanHangPhaiThuService } from './bc-ban-hang-phai-thu.service';


@Module({
    controllers: [BcBanHangPhaiThuController],
    providers: [BcBanHangPhaiThuService],
})
export class BcBanHangPhaiThuModule { }
