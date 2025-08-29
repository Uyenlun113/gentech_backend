import { Injectable, BadRequestException } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConfig } from 'src/config/sql.config';
import { formatDateToYYYYMMDD } from 'src/type/date';

@Injectable()
export class BcMuaHangService {
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
                ma_dvcs,
                ma_kho,
                ma_kho_nhap,
                ma_kho_xuat,
                loai_phieu_nhap,
            } = dto;
            let rpData = {}
            switch (configName) {
                case "bang_ke_phieu_nhap":
                    rpData = await this.bangKePhieuNhap({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        ma_vat_tu,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                        loai_phieu_nhap,
                    });
                    break;

                case "bang_ke_hoa_don_mua_hang_dv":
                    rpData = await this.bangKeHoaDonMuaHangDV({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        chung_tu_tu_so,
                        den_so,
                    });
                    break;

                default:
                    throw new Error(`Config ${configName} không hợp lệ`);
            }

            return rpData
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    //nhập
    async bangKePhieuNhap({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        chung_tu_tu_so,
        den_so,
        ma_kho,
        loai_phieu_nhap,   // tham số riêng, không ghép vào condition
    }) {
        try {
            // Chuyển ngày sang dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`and 1=1`);
            conditionParts.push(`and ngay_ct >= '${startDate}'`);
            conditionParts.push(`and ngay_ct <= '${endDate}'`);

            // Chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }

            // Mã khách (LIKE)
            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh LIKE '${ma_khach.trim()}%'`);
            }

            // Mã vật tư (LIKE)
            if (ma_vat_tu?.trim()) {
                conditionParts.push(`and ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }

            // Mã kho (LIKE)
            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            // Đơn vị cơ sở
            conditionParts.push(`and ma_dvcs LIKE 'CTY%'`);

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('LocVatTu', sql.Int, 0);
            request.input('LoaiPhieuNhap', sql.Int, loai_phieu_nhap);

            const result = await request.execute('POBK1');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition // trả ra condition để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bangKeHoaDonMuaHangDV({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        chung_tu_tu_so,
        den_so,
    }) {
        try {
            // Chuyển ngày sang dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`and 1=1`);
            conditionParts.push(`and ngay_ct >= '${startDate}'`);
            conditionParts.push(`and ngay_ct <= '${endDate}'`);

            // Chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }

            // Mã khách (LIKE)
            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh LIKE '${ma_khach.trim()}%'`);
            }

            // Đơn vị cơ sở
            conditionParts.push(`and ma_dvcs LIKE 'CTY%'`);

            // Loại bỏ 1 số mã chứng từ
            conditionParts.push(`AND dbo.TRIM(ma_ct) NOT IN ('PT1', 'BC1', 'PN0')`);

            // Chỉ lấy chưa thanh toán
            conditionParts.push(`and ma_tt = 0`);

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            // Gọi stored procedure POBK1TA
            const result = await request.execute('POBK1TA');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bangKePhieuXuatTraLaiNCC({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        chung_tu_tu_so,
        den_so,
        ma_kho,
    }) {
        try {
            // Chuyển ngày sang dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`and 1=1`);
            conditionParts.push(`and ngay_ct >= '${startDate}'`);
            conditionParts.push(`and ngay_ct <= '${endDate}'`);

            // Chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }

            // Mã khách (LIKE)
            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh LIKE '${ma_khach.trim()}%'`);
            }

            // Mã kho (LIKE)
            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            // Mã kho thuộc đơn vị cơ sở
            conditionParts.push(
                `and ma_kho in (Select ma_kho From dmkho Where ma_dvcs like 'CTY%')`
            );

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            // Gọi stored procedure POBK1F
            const result = await request.execute('POBK1F');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // để debug
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
