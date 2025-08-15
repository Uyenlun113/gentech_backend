import { BadRequestException, Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConfig } from 'src/config/sql.config';
import { formatDateToYYYYMMDD } from 'src/type/date';
import { CallStoreDto } from './bc-ban-hang-phai-thu.dto';

@Injectable()
export class BcBanHangPhaiThuService {
    async callStore(dto: CallStoreDto) {
        try {
            const {
                StartDate,
                EndDate,
                so_ct_from,
                so_ct_to,
                ma_kh,
                ma_kho,
                ma_vt,
                ma_dvcs,
                ma_gd,
                pListVoucher,
                kindFilter,
                methodName
            } = dto;

            switch (methodName) {
                case 'import-plan':
                    return await this.bcDonBanHang(
                        StartDate,
                        EndDate,
                        so_ct_from,
                        so_ct_to,
                        ma_kh,
                        ma_kho,
                        ma_vt,
                        ma_dvcs,
                        ma_gd,
                        'HDA;HDX',
                        0
                    );
                case 'export-plan':
                    return await this.bcDonBanHangBanDV(
                        StartDate,
                        EndDate,
                        so_ct_from,
                        so_ct_to,
                        ma_kh,
                        ma_dvcs,
                    );
                case 'import-export-plan':
                    return await this.bcNhaphangBanBiTralai(
                        StartDate,
                        EndDate,
                        so_ct_from,
                        so_ct_to,
                        ma_kh,
                        ma_kho,
                        ma_dvcs,
                        'PNF');
                case 'inventory2':
                    return await this.bcDonMotMatHang(
                        StartDate,
                        EndDate,
                        ma_vt,
                        ma_kho,
                        ma_dvcs,
                    );
                case 'inventory-detail2':
                    return await this.bcSobk3(
                        StartDate,
                        EndDate,
                        ma_vt,
                        ma_dvcs,
                        ma_kho,
                        ["HDA", "HDX"],
                        2,
                        'ma_kh',
                    )
                case 'import-export-summary2':
                    return await this.bcSobk3(
                        StartDate,
                        EndDate,
                        ma_vt,
                        ma_dvcs,
                        ma_kho,
                        ["HDA", "HDX"],
                        2,
                        'ma_nx',
                    )
                case 'import-export-detail':
                    return await this.bcSobk4(
                        StartDate,
                        EndDate,
                        ma_vt,
                        ma_dvcs,
                        ma_kho,
                        ["HDA", "HDX"],
                        ma_kh,
                        2,
                    )

                default:
                    throw new BadRequestException(`Phương thức ${methodName} không hợp lệ`);
            }
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcDonBanHang(
        StartDate: string,
        EndDate: string,
        so_ct_from?: string,
        so_ct_to?: string,
        ma_kh?: string,
        ma_kho?: string,
        ma_vt?: string,
        ma_dvcs?: string,
        ma_gd?: string,
        pListVoucher?: string,
        kindFilter?: number
    ) {
        try {
            const ngay1 = formatDateToYYYYMMDD(new Date(StartDate));
            const ngay2 = formatDateToYYYYMMDD(new Date(EndDate));

            let condition = ' AND 1=1';
            if (ngay1) condition += ` AND ngay_ct >= '${ngay1}'`;
            if (ngay2) condition += ` AND ngay_ct <= '${ngay2}'`;
            if (so_ct_from) condition += ` AND so_ct >= '${so_ct_from.padStart(11, ' ')}'`;
            if (so_ct_to) condition += ` AND so_ct <= '${so_ct_to.padStart(11, ' ')}'`;
            if (ma_kh) condition += ` AND ma_kh LIKE '${ma_kh}%'`;
            if (ma_kho) condition += ` AND ma_kho LIKE '${ma_kho}%'`;
            if (ma_vt) condition += ` AND ma_vt LIKE '${ma_vt}%'`;
            if (ma_dvcs) condition += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            if (ma_gd) condition += ` AND ma_gd = '${ma_gd}'`;

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), ngay1);
            request.input('EndDate', sql.VarChar(8), ngay2);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('pListVoucher', sql.NVarChar(50), pListVoucher || '');
            request.input('KindFilter', sql.Int, kindFilter || 0);

            const result = await request.execute('SOBK1');
            console.log(result);

            return {
                data1: result.recordsets[0] || [],
                data2: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcDonBanHangBanDV(
        StartDate: string,
        EndDate: string,
        so_ct_from?: string,
        so_ct_to?: string,
        ma_kh?: string,
        ma_dvcs?: string,
    ) {
        try {
            const ngay1 = formatDateToYYYYMMDD(new Date(StartDate));
            const ngay2 = formatDateToYYYYMMDD(new Date(EndDate));

            // Build condition
            let condition = ' AND 1=1';
            if (ngay1) condition += ` AND ngay_ct >= '${ngay1}'`;
            if (ngay2) condition += ` AND ngay_ct <= '${ngay2}'`;
            if (so_ct_from) condition += ` AND so_ct >= '${so_ct_from.padStart(11, ' ')}'`;
            if (so_ct_to) condition += ` AND so_ct <= '${so_ct_to.padStart(11, ' ')}'`;
            if (ma_kh) condition += ` AND ma_kh LIKE '${ma_kh}%'`;
            if (ma_dvcs) condition += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            condition += ` AND dbo.TRIM(ma_ct) NOT IN ('PC1','BN1','HD0')`;
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), ngay1);
            request.input('EndDate', sql.VarChar(8), ngay2);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            const result = await request.execute('SOBK1TA');
            return {
                data1: result.recordset || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bcNhaphangBanBiTralai(
        StartDate: string,
        EndDate: string,
        so_ct_from?: string,
        so_ct_to?: string,
        ma_kh?: string,
        ma_kho?: string,
        ma_dvcs?: string,
        pListVoucher?: string,

    ) {
        try {
            const ngay1 = formatDateToYYYYMMDD(new Date(StartDate));
            const ngay2 = formatDateToYYYYMMDD(new Date(EndDate));

            // Build condition
            let condition = ' AND 1=1';
            if (ngay1) condition += ` AND ngay_ct >= '${ngay1}'`;
            if (ngay2) condition += ` AND ngay_ct <= '${ngay2}'`;
            if (so_ct_from) condition += ` AND so_ct >= '${so_ct_from.padStart(11, ' ')}'`;
            if (so_ct_to) condition += ` AND so_ct <= '${so_ct_to.padStart(11, ' ')}'`;
            if (ma_kh) condition += ` AND ma_kh LIKE '${ma_kh}%'`;
            if (ma_kho) condition += ` AND ma_kho LIKE '${ma_kho}%'`;
            if (ma_dvcs) condition += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            condition += ` AND dbo.TRIM(ma_ct) NOT IN ('PC1','BN1','HD0')`;
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), ngay1);
            request.input('EndDate', sql.VarChar(8), ngay2);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('pListVoucher', sql.NVarChar(50), pListVoucher || '');
            const result = await request.execute('SOBK1F');
            return {
                data1: result.recordsets[0] || [],
                data2: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcDonMotMatHang(
        StartDate: string,
        EndDate: string,
        ma_vt?: string,
        ma_kho?: string,
        ma_dvcs?: string,
    ) {
        try {
            const ngay1 = formatDateToYYYYMMDD(new Date(StartDate));
            const ngay2 = formatDateToYYYYMMDD(new Date(EndDate));

            let condition = '1=1';
            if (ma_dvcs) condition += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            if (ma_kho) condition += ` AND ma_kho LIKE '${ma_kho}%'`;

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();
            request.input('MaVt', sql.NVarChar(5), ma_vt || '');
            request.input('StartDate', sql.VarChar(8), ngay1);
            request.input('EndDate', sql.VarChar(8), ngay2);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            const result = await request.execute('SOBK2');
            return {
                data2: result.recordsets[0] || [],
                data1: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcSobk3(
        StartDate: string,
        EndDate: string,
        ma_vt?: string,
        ma_dvcs?: string,
        ma_kho?: string,
        ma_ct_list?: string[],
        nxt?: number,
        groupBy: string = 'ma_kh',
    ) {
        try {
            let sKey = '';
            if (ma_ct_list?.length) {
                const ctList = ma_ct_list.map(ct => `'${ct}'`).join(', ');
                sKey += ` AND ma_ct IN (${ctList})`;
            }
            if (nxt !== undefined) {
                sKey += ` AND nxt = ${nxt}`;
            }
            if (ma_vt) {
                sKey += ` AND ma_vt LIKE '${ma_vt}%'`;
            }
            sKey += ` AND LEN(ISNULL(ma_kh,'')) <> 0`;
            if (ma_dvcs) {
                sKey += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            }
            if (ma_kho) {
                sKey += ` AND ma_kho LIKE '${ma_kho}%'`;
            }

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('ngay_ct1', sql.DateTime, new Date(StartDate));
            request.input('ngay_ct2', sql.DateTime, new Date(EndDate));
            request.input('sKey', sql.NVarChar(sql.MAX), sKey);
            request.input('pGroup', sql.VarChar(50), groupBy);
            const result = await request.execute('SOBK3');
            return {
                // data2: result.recordset || [],
                data2: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcSobk4(
        StartDate: string,
        EndDate: string,
        ma_vt?: string,
        ma_dvcs?: string,
        ma_kho?: string,
        ma_ct_list?: string[],
        ma_kh?: string,
        nxt?: number,
    ) {
        try {
            let sKey = '';

            if (ma_ct_list?.length) {
                const ctList = ma_ct_list.map(ct => `'${ct}'`).join(', ');
                sKey += ` AND ma_ct IN (${ctList})`;
            }
            if (nxt !== undefined) {
                sKey += ` AND nxt = ${nxt}`;
            }
            if (ma_kh) {
                sKey += ` AND ma_kh = '${ma_kh}'`;
            }
            sKey += ` AND LEN(ISNULL(ma_kh,'')) <> 0`;

            if (ma_dvcs) {
                sKey += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            }
            if (ma_kho) {
                sKey += ` AND ma_kho LIKE '${ma_kho}%'`;
            }
            if (ma_vt) {
                sKey += ` AND ma_vt LIKE '${ma_vt}%'`;
            }

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('ngay_ct1', sql.DateTime, new Date(StartDate));
            request.input('ngay_ct2', sql.DateTime, new Date(EndDate));
            request.input('sKey', sql.NVarChar(sql.MAX), sKey);

            const result = await request.execute('SOBK4');
            console.log('result', result);

            return {
                data2: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
}
