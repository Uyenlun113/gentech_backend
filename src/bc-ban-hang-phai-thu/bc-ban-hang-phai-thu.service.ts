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
                ma_tk,
                ghi_no_co,
                methodName,
                ma_khach,
                tai_khoan,
                ngay,
                chi_tiet,
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
                case 'inventory-report':
                    return await this.bcArctbh1(
                        StartDate,
                        EndDate,
                        dto.tk_doanh_thu,
                        dto.tk_giam_tru,
                        ma_vt,
                        ma_dvcs,
                        ma_kho,
                    );
                case 'cost-analysis':
                    return await this.bcGlbk1(
                        StartDate,
                        EndDate,
                        ma_dvcs,
                        ma_tk
                    );
                case 'performance-report':
                    return await this.bcGlbk2(
                        StartDate,
                        EndDate,
                        ma_dvcs,
                        ma_tk,
                        ghi_no_co
                    );
                case 'turnover-analysis':
                    return await this.bcGlth2(
                        StartDate,
                        EndDate,
                        ma_dvcs,
                        ma_tk,
                        ghi_no_co
                    );
                case 'abc-analysis':
                    return await this.arsd2(
                        ma_khach,
                        tai_khoan,
                        ma_dvcs,
                        ngay
                    );
                case 'inventory-valuation':
                    return await this.arso1b(
                        ma_tk,
                        ma_kh,
                        StartDate,
                        EndDate,
                        chi_tiet || 0,
                        ma_dvcs,

                    );


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

            return {
                data2: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcArctbh1(
        StartDate: string,
        EndDate: string,
        tk_doanh_thu?: string,
        tk_giam_tru?: string,
        ma_vt?: string,
        ma_dvcs?: string,
        ma_kho?: string,
    ) {
        try {
            const tuNg = formatDateToYYYYMMDD(new Date(StartDate));
            const denNg = formatDateToYYYYMMDD(new Date(EndDate));

            // Build filter condition
            let filter = ' 1=1';
            if (ma_vt) filter += ` and ma_vt like '${ma_vt}%'`;
            if (ma_dvcs) filter += ` and ma_dvcs Like '${ma_dvcs}%'`;
            if (ma_kho) filter += ` and ma_kho like '${ma_kho}%'`;

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Đặt các input cho proc
            request.input('TuNg', sql.VarChar(8), tuNg);
            request.input('DenNg', sql.VarChar(8), denNg);
            request.input('tk_dt', sql.VarChar(10), tk_doanh_thu || '511');
            request.input('tk_gt', sql.VarChar(50), tk_giam_tru || '521,531,532');
            request.input('filter', sql.VarChar(sql.MAX), filter);

            const result = await request.execute('ARCTBH1');

            return {
                data1: result.recordsets || [],
                data2: result.recordset || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bcGlbk1(
        StartDate: string,
        EndDate: string,
        ma_dvcs?: string,
        tk?: string,
    ) {
        try {
            const tuNg = formatDateToYYYYMMDD(new Date(StartDate));
            const denNg = formatDateToYYYYMMDD(new Date(EndDate));
            let filter = '';
            if (tk) filter += ` AND tk LIKE '${tk}%'`;
            if (ma_dvcs) filter += ` AND ma_dvcs LIKE '${ma_dvcs}%'`;
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();
            request.input('StartDate', sql.VarChar(8), tuNg);
            request.input('EndDate', sql.VarChar(8), denNg);
            request.input('Condition', sql.NVarChar(sql.MAX), filter);

            const result = await request.execute('GLBK1');

            return {
                data2: result.recordset || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bcGlbk2(
        StartDate: string,
        EndDate: string,
        ma_dvcs?: string,
        tk?: string,
        ghi_no_co?: number,
    ) {
        try {
            const tuNg = formatDateToYYYYMMDD(new Date(StartDate));
            const denNg = formatDateToYYYYMMDD(new Date(EndDate));
            let filter = '1=1';
            if (ma_dvcs) filter += ` and ma_dvcs LIKE '${ma_dvcs}%'`;
            if (tk) filter += ` and tk LIKE '${tk}%'`;

            const ghiNoCo = Number(ghi_no_co);
            if (ghiNoCo === 1) {
                filter += ' and ps_no<>0';
            } else if (ghiNoCo === 2) {
                filter += ' and ps_co<>0';
            }
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('store', sql.VarChar(5), 'glbk2');
            request.input('ngay_ct1', sql.Char(8), tuNg);
            request.input('ngay_ct2', sql.Char(8), denNg);
            request.input('tk', sql.VarChar(8), tk || '');
            request.input('condition', sql.NVarChar(200), filter);
            request.input('loai_bc', sql.Char(1), '3');

            const query = `
            EXEC sp_executesql 
                N'EXEC @store @ngay_ct1, @ngay_ct2, @tk, @condition, @loai_bc',
                N'@store varchar(5), @ngay_ct1 char(8), @ngay_ct2 char(8), @tk varchar(3), @condition nvarchar(200), @loai_bc char(1)',
                @store, @ngay_ct1, @ngay_ct2, @tk, @condition, @loai_bc
        `;

            const result = await request.query(query);

            return {
                data2: result.recordset || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bcGlth2(
        StartDate: string,
        EndDate: string,
        ma_dvcs?: string,
        tk?: string,
        ghi_no_co?: number,
    ) {
        try {
            const tuNg = formatDateToYYYYMMDD(new Date(StartDate));
            const denNg = formatDateToYYYYMMDD(new Date(EndDate));
            let filter = '1=1';
            if (ma_dvcs) filter += ` and ma_dvcs LIKE '${ma_dvcs}%'`;
            if (tk) filter += ` and tk LIKE '${tk}%'`;

            const ghiNoCo = Number(ghi_no_co);
            if (ghiNoCo === 1) {
                filter += ' and ps_no<>0';
            } else if (ghiNoCo === 2) {
                filter += ' and ps_co<>0';
            }

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('store', sql.VarChar(5), 'glth2');
            request.input('loai_bc', sql.Char(1), '3');
            request.input('ngay_ct1', sql.Char(8), tuNg);
            request.input('ngay_ct2', sql.Char(8), denNg);
            request.input('tk', sql.VarChar(4), tk || '');   // varchar(4) đúng với proc mẫu
            request.input('condition', sql.NVarChar(200), filter);

            const query = `
            EXEC sp_executesql 
                N'EXEC @store @loai_bc, @ngay_ct1, @ngay_ct2, @tk, @condition',
                N'@store varchar(5), @loai_bc char(1), @ngay_ct1 char(8), @ngay_ct2 char(8), @tk varchar(4), @condition nvarchar(200)',
                @store, @loai_bc, @ngay_ct1, @ngay_ct2, @tk, @condition
        `;

            const result = await request.query(query);

            return {
                data2: result.recordset || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async arsd2(
        ma_kh: string,
        tk: string,
        ma_dvcs?: string,
        ngay_ct?: string,
    ) {
        try {
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();
            request.input('ma_kh', sql.VarChar(20), ma_kh);
            request.input('tk', sql.VarChar(20), tk);
            request.input('ma_dvcs', sql.VarChar(20), ma_dvcs);
            request.input('ngay_ct', sql.Char(10), ngay_ct);
            const query = `
                EXEC ARSD2 
                    @ma_kh = @ma_kh, 
                    @tk = @tk, 
                    @ma_dvcs = @ma_dvcs, 
                    @ngay_ct = @ngay_ct
                `;
            const result = await request.query(query);
            return {
                data1: result.recordset || [],
                data2: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async arso1b(
        ma_tk?: string,
        ma_kh?: string,
        StartDate?: string,
        EndDate?: string,
        chitiet?: number,
        ma_dvcs?: string,
    ) {
        try {
            const ctTuNg = formatDateToYYYYMMDD(StartDate ? new Date(StartDate) : new Date());
            const ctDenNg = formatDateToYYYYMMDD(EndDate ? new Date(EndDate) : new Date());
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();
            request.input('ma_tk', sql.Char(4), ma_tk);
            request.input('ma_kh', sql.Char(5), ma_kh);
            request.input('ctTuNg', sql.VarChar(8), ctTuNg);
            request.input('ctDenNg', sql.VarChar(8), ctDenNg);
            request.input('chitiet', sql.Char(1), chitiet);
            request.input('ma_dvcs', sql.Char(3), ma_dvcs);
            request.input('filter', sql.VarChar(200), '1=1');

            const query = `
                EXEC sp_executesql 
                    N'EXEC ARSO1B @ma_tk, @ma_kh, @ctTuNg, @ctDenNg, @chitiet, @ma_dvcs, @filter',
                    N'@ma_tk CHAR(4), 
                    @ma_kh CHAR(5), 
                    @ctTuNg VARCHAR(8), 
                    @ctDenNg VARCHAR(8), 
                    @chitiet CHAR(1), 
                    @ma_dvcs CHAR(3), 
                    @filter VARCHAR(200)',
                    @ma_tk, @ma_kh, @ctTuNg, @ctDenNg, @chitiet, @ma_dvcs, @filter
                `;
            const result = await request.query(query);
            return {
                data1: result.recordsets[1] || [],
                data2: result.recordset || []
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }


}
