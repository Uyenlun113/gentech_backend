import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConfig } from 'src/config/sql.config';
import { CallStoreDto } from './dto/call-store.dto';
import { formatDateToYYYYMMDD } from 'src/type/date';
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class BcTienmatTienguiBankService {
    async callStore(dto: CallStoreDto) {
        try {

            const { store, tk, ngay_ct1, ngay_ct2, gop_tk, ma_dvcs } = dto;
            const ngay_ct0_raw = new Date(ngay_ct1 ?? '');
            const ngay_ct2_raw = new Date(ngay_ct2 ?? '');
            const ngay_ct1New = formatDateToYYYYMMDD(ngay_ct0_raw);
            const ngay_ct2New = formatDateToYYYYMMDD(ngay_ct2_raw);
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();
            request.input('tk', sql.VarChar, tk);
            request.input('ngay_ct1', sql.VarChar, ngay_ct1New);
            request.input('ngay_ct2', sql.VarChar, ngay_ct2New);
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
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
}
