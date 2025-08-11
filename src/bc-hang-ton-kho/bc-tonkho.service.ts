import { Injectable, BadRequestException } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConfig } from 'src/config/sql.config';
import { formatDateToYYYYMMDD } from 'src/type/date';

@Injectable()
export class BcTonKhoService {
    async callStore(dto: any) {
        try {
            const {
                ngay_ct1,
                ngay_ct2,
                ma_khach,
                ma_vat_tu,
                chung_tu_tu_so,
                den_so,
                configName,
                kieu_loc,
                mau_vnd_ngoai_te,
                ma_dvcs
            } = dto;

            // Chuyển ngày sang dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`and 1=1`);
            conditionParts.push(`and ngay_ct >= '${startDate}'`);
            conditionParts.push(`and ngay_ct <= '${endDate}'`);
            conditionParts.push(`and ma_kho IN (SELECT ma_kho FROM dmkho where ma_dvcs LIKE 'CTY%')`);

            // Chứng từ từ số
            if (chung_tu_tu_so !== undefined && chung_tu_tu_so !== null && chung_tu_tu_so !== '') {
                conditionParts.push(`and dbo.trim(so_ct) >= ${Number(chung_tu_tu_so)}`);
            }

            // Chứng từ đến số
            if (den_so !== undefined && den_so !== null && den_so !== '') {
                conditionParts.push(`and dbo.trim(so_ct) <= ${Number(den_so)}`);
            }

            // Mã khách
            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh = '${ma_khach.trim()}'`);
            }

            // Mã vật tư
            if (ma_vat_tu?.trim()) {
                conditionParts.push(`and ma_vt = '${ma_vat_tu.trim()}'`);
            }

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('LocVatTu', sql.Int, 0);

            const result = await request.execute('INBK1N');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition // trả ra condition để debug
            };

        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
}

function parseDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}
