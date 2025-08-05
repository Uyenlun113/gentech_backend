import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConfig } from 'src/config/sql.config';
import { CallStoreDto } from './dto/call-store.dto';

@Injectable()
export class BcTienmatTienguiBankService {
    async callStore(dto: CallStoreDto) {
        const { store, tk, ngay_ct1, ngay_ct2, gop_tk, ma_dvcs } = dto;
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        request.input('tk', sql.VarChar, tk);
        request.input('ngay_ct1', sql.SmallDateTime, ngay_ct1);
        request.input('ngay_ct2', sql.SmallDateTime, ngay_ct2);
        request.input('ma_dvcs', sql.VarChar, ma_dvcs);
        if (gop_tk == '0') {
            request.input('gop_tk', sql.Int, Number(gop_tk));
            const result = await request.execute(store);
            return {
                data: result.recordsets[0],
                totals: result.recordsets[1],
            };
        } else {
            const result = await request.execute(store);
            return {
                data: result.recordsets[0],
                totals: result.recordsets[1],
            };
        }
    }
}
