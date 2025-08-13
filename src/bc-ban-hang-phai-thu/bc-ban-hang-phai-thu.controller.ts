import { Controller, Get, Query } from '@nestjs/common';
import { CallStoreDto } from './bc-ban-hang-phai-thu.dto';
import { BcBanHangPhaiThuService } from './bc-ban-hang-phai-thu.service';


@Controller('bcbanhang')
export class BcBanHangPhaiThuController {
    constructor(private readonly service: BcBanHangPhaiThuService) { }

    @Get('hd-ban-hang')
    async callStore(@Query() dto: CallStoreDto) {
        return this.service.callStore(dto);
    }
}
