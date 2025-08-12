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
                ma_dvcs,
                ma_kho,
                ma_kho_nhap,
                ma_kho_xuat
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
                    });
                    break;

                // bạn có thể thêm case khác nếu cần
                case "bang_ke_phieu_nhap_mat_hang":
                    rpData = await this.bangKePhieuNhapCuaMotMatHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vat_tu,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho
                    });
                    break;

                case "bang_ke_phieu_nhap_mat_hang_ncc":
                    rpData = await this.bangKePhieuNhapCuaMotMatHangNhomTheoNCC({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vat_tu,
                        chung_tu_tu_so,
                        den_so,
                    });
                    break;

                case "bang_ke_phieu_nhap_ncc_mat_hang":
                    rpData = await this.bangKePhieuNhapCuaMotNCCNhomTheoMatHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_kho,
                        ma_khach
                    });
                    break;

                case "tong_hop_hang_nhap_kho":
                    rpData = await this.tongHopHangNhapKho({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        ma_vat_tu,
                        ma_kho
                    });
                    break;

                case "bang_ke_phieu_xuat":
                    rpData = await this.bangKePhieuXuat({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        ma_vat_tu,
                        chung_tu_tu_so,
                        den_so
                    });
                    break;

                case "bang_ke_phieu_xuat_mat_hang":
                    rpData = await this.bangKePhieuXuatCuaMotMatHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vat_tu,
                        ma_dvcs,
                        ma_kho_nhap,
                        ma_kho_xuat
                    });
                    break;

                case "bang_ke_phieu_xuat_mat_hang_khach_hang":
                    rpData = await this.bangKePhieuXuatCuaMotMatHangNhomTheoNCC({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        ma_vat_tu,
                        ma_dvcs,
                    });
                    break;

                case "bang_ke_phieu_xuat_khach_hang_mat_hang":
                    rpData = await this.bangKeXuatCuaMotKhachHangNhomTheoMatHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        ma_vat_tu,
                        ma_dvcs,
                        ma_kho,
                    });
                    break;

                case "tong_hop_hang_xuat_kho":
                    rpData = await this.tongHopHangXuatKho({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach,
                        ma_vat_tu,
                        ma_kho,
                        ma_dvcs
                    });
                    break;

                case "the_kho_chi_tiet_vat_tu":
                    rpData = await this.theKhoSoChiTiet({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vat_tu,
                        ma_kho,
                        ma_dvcs
                    });
                    break;

                case "tong_hop_nhap_xuat_ton":
                    rpData = await this.tongHopNhapXuatTon({
                        ngay_ct1,
                        ngay_ct2,
                        // tinh_dc,
                        ma_vat_tu,
                        ma_kho,
                        ma_dvcs
                    });
                    break;

                case "tong_hop_nhap_xuat_ton_quy_doi":
                    rpData = await this.tongHopNhapXuatTonQuyDoi({
                        ngay_ct1,
                        ngay_ct2,
                        // tinh_dc,
                        ma_vat_tu,
                        ma_kho,
                        ma_dvcs
                    });
                    break;

                case "tong_hop_chi_tiet_vat_tu":
                    rpData = await this.tongHopChiTietVT({
                        ngay_ct1,
                        ngay_ct2,
                        // tinh_dc,
                        ma_vat_tu,
                        ma_kho,
                        ma_dvcs
                    });
                    break;

                case "bao_cao_ton_kho":
                    rpData = await this.baoCaoTonKho({
                        ngay_ct2,
                        ma_kho,
                        ma_vat_tu,
                        ma_dvcs
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
        den_so }) {
        try {

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
    async bangKePhieuNhapCuaMotMatHang({
        ngay_ct1,
        ngay_ct2,
        ma_vat_tu,     // MaVt
        chung_tu_tu_so,
        den_so,
        ma_kho
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1)); // YYYYMMDD
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`1=1`);
            conditionParts.push(`and ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs like 'CTY%')`);

            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }
            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }
            if (ma_kho?.trim()) {
                // Có thể không cần filter ở Condition vì đã có @MaVt
                conditionParts.push(`and ma_kho like '${ma_kho.trim()}'`);
            }

            const condition = conditionParts.join(' ');

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Tham số theo sp_executesql
            request.input('MaVt', sql.NVarChar(5), ma_vat_tu.trim() || '');
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            // Gọi thẳng stored procedure
            const result = await request.execute('POBK2');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKePhieuNhapCuaMotMatHangNhomTheoNCC({
        ngay_ct1,
        ngay_ct2,
        ma_vat_tu,
        chung_tu_tu_so,
        den_so,
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1)); // 'YYYYMMDD'
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // filter mặc định
            const filter = ' 1=1 ';

            // condition động
            let conditionParts: string[] = [];
            conditionParts.push(' 1=1 ');
            if (ma_vat_tu?.trim()) {
                conditionParts.push(`and ma_vt = '${ma_vat_tu.trim()}'`);
            }
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }
            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }
            conditionParts.push(`and ma_dvcs like 'CTY%'`);

            const condition = conditionParts.join(' ');

            const group = 'ma_kh'; // Nhóm theo mã khách/NCC

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Khai báo đúng loại và độ dài như trong câu SQL gốc
            request.input('ctTuNg', sql.VarChar(8), startDate);
            request.input('ctDenNg', sql.VarChar(8), endDate);
            request.input('filter', sql.VarChar(5), filter);
            request.input('condition', sql.VarChar(sql.MAX), condition);
            request.input('group', sql.VarChar(5), group);

            const result = await request.execute('INBK3N');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition,
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKePhieuNhapCuaMotNCCNhomTheoMatHang({
        ngay_ct1,
        ngay_ct2,
        ma_kho,
        ma_khach
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // filter mặc định
            const filter = ' 1=1 ';

            // condition động
            let conditionParts: string[] = [];
            conditionParts.push(' 1=1 ');
            conditionParts.push(`and ma_dvcs like 'CTY%'`);

            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho = '${ma_kho.trim()}'`);
            }

            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh = '${ma_khach.trim()}'`);
            }

            const condition = conditionParts.join(' ');

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Khai báo kiểu & độ dài như câu SQL gốc
            request.input('ctTuNg', sql.VarChar(8), startDate);
            request.input('ctDenNg', sql.VarChar(8), endDate);
            request.input('filter', sql.VarChar(5), filter);
            request.input('condition', sql.VarChar(sql.MAX), condition);

            const result = await request.execute('INBK4N');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async tongHopHangNhapKho({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        ma_kho
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            let advanceParts = [
                "1=1",
                "AND ma_gd IN(1, 2, 3, 4, 5, 6, 9)",
                "AND ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE 'CTY%')"
            ];

            if (ma_khach?.trim()) advanceParts.push(`AND ma_kh LIKE '${ma_khach.trim()}%'`);
            if (ma_vat_tu?.trim()) advanceParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            if (ma_kho?.trim()) advanceParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);

            const advance = advanceParts.join(" ");

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('ngay_ct1', sql.Char(8), startDate);
            request.input('ngay_ct2', sql.Char(8), endDate);
            request.input('advance', sql.NVarChar(sql.MAX), advance);

            // Gọi thẳng proc nếu INTH1N nhận đúng 3 tham số
            const result = await request.execute('INTH1N');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    //xuất
    async bangKePhieuXuat({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        chung_tu_tu_so,
        den_so
    }) {
        try {
            // Format ngày
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`); // không cần "and" đầu tiên vì sẽ join bằng space

            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh like '${ma_khach.trim()}%'`);
            }

            // Nếu muốn lọc theo đơn vị công ty
            conditionParts.push(`and ma_dvcs LIKE 'CTY%'`);

            // Chứng từ từ số
            if (chung_tu_tu_so !== undefined && chung_tu_tu_so !== null && chung_tu_tu_so !== '') {
                conditionParts.push(`and dbo.trim(so_ct) >= ${Number(chung_tu_tu_so)}`);
            }

            // Chứng từ đến số
            if (den_so !== undefined && den_so !== null && den_so !== '') {
                conditionParts.push(`and dbo.trim(so_ct) <= ${Number(den_so)}`);
            }

            const condition = conditionParts.join(' ').trim();

            // Connect SQL
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Gán tham số
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Ma_vt', sql.NVarChar(5), ma_vat_tu?.trim() || '');
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('LocVatTu', sql.Int, 0);

            // Gọi proc
            const result = await request.execute('INBK1X');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition // trả ra condition để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKePhieuXuatCuaMotMatHang({
        ngay_ct1,
        ngay_ct2,
        ma_vat_tu,
        ma_dvcs,
        ma_kho_nhap,
        ma_kho_xuat
    }) {
        try {
            // Format ngày
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            if (ma_dvcs?.trim()) {
                conditionParts.push(`and ma_dvcs like '${ma_dvcs.trim()}%'`);
            }
            if (ma_kho_nhap?.trim()) {
                conditionParts.push(`and ma_kho like '${ma_kho_nhap.trim()}%'`);
            }
            if (ma_kho_xuat?.trim()) {
                conditionParts.push(`and ma_khon like '${ma_kho_xuat.trim()}%'`);
            }

            const condition = conditionParts.join(' ').trim();

            // Kết nối SQL
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('MaVt', sql.NVarChar(5), ma_vat_tu?.trim() || '');
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            const result = await request.execute('INBK2X');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKePhieuXuatCuaMotMatHangNhomTheoNCC({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        ma_dvcs,
        // nxt,
    }) {
        try {
            // Chuyển ngày sang dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            // if (nxt !== undefined && nxt !== null) {
            //     conditionParts.push(`and nxt = ${Number(nxt)}`);
            // }
            conditionParts.push(`and nxt = 2`);

            conditionParts.push(`and ngay_ct >= '${startDate}'`);
            conditionParts.push(`and ngay_ct <= '${endDate}'`);

            if (ma_dvcs?.trim()) {
                conditionParts.push(`and ma_dvcs like '${ma_dvcs.trim()}'`);
            }

            if (ma_khach?.trim()) {
                conditionParts.push(`and ma_kh = '${ma_khach.trim()}'`);
            }

            if (ma_vat_tu?.trim()) {
                conditionParts.push(`and ma_vt = '${ma_vat_tu.trim()}'`);
            }

            const condition = conditionParts.join(' ').trim();

            // Kết nối DB
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('condition', sql.NVarChar(sql.MAX), condition);
            request.input('pGroup', sql.NVarChar(5), 'ma_kh');

            // Gọi proc
            const result = await request.execute('INBK3X');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKeXuatCuaMotKhachHangNhomTheoMatHang({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        ma_dvcs,
        ma_kho,
        // nxt,D
    }) {
        try {
            // Chuyển ngày sang dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            // if (nxt !== undefined && nxt !== null) {
            //     conditionParts.push(`and nxt = ${Number(nxt)}`);
            // }

            conditionParts.push(`and nxt = 2`);
            conditionParts.push(`and ngay_ct >= '${startDate}'`);
            conditionParts.push(`and ngay_ct <= '${endDate}'`);

            if (ma_dvcs?.trim()) {
                conditionParts.push(`and ma_dvcs like '${ma_dvcs.trim()}%'`);
            }

            if (ma_khach?.trim()) {
                conditionParts.push(`and rtrim(ltrim(ma_kh)) = '${ma_khach.trim()}'`);
            }

            if (ma_vat_tu?.trim()) {
                conditionParts.push(`and rtrim(ltrim(ma_vt)) = '${ma_vat_tu.trim()}'`);
            }

            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho = '${ma_kho.trim()}'`);
            }

            const condition = conditionParts.join(' ').trim();

            // Kết nối DB
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('condition', sql.NVarChar(sql.MAX), condition);
            request.input('pGroup', sql.NVarChar(5), 'ma_kh');

            // Gọi proc
            const result = await request.execute('INBK3X');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async tongHopHangXuatKho({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        ma_kho,
        ma_dvcs
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            if (ma_khach?.trim()) {
                conditionParts.push(`AND ma_kh like '${ma_khach.trim()}%'`);
            }

            if (ma_vat_tu?.trim()) {
                conditionParts.push(`AND ma_vt like '${ma_vat_tu.trim()}%'`);
            }

            if (ma_dvcs?.trim()) {
                conditionParts.push(`AND ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`);
            }

            if (ma_kho?.trim()) {
                conditionParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            const advance = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('ngay_ct1', sql.Char(8), startDate);
            request.input('ngay_ct2', sql.Char(8), endDate);
            request.input('advance', sql.NVarChar(sql.MAX), advance);

            const result = await request.execute('INTH1X');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                // condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    //tồn
    async theKhoSoChiTiet({
        ngay_ct1,
        ngay_ct2,
        ma_vat_tu,
        ma_kho,
        ma_dvcs
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            if (ma_kho?.trim()) {
                conditionParts.push(`AND ma_kho LIKE '${ma_kho.trim()}'`);
            }

            if (ma_vat_tu?.trim()) {
                conditionParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}'`);
            }

            if (ma_dvcs?.trim()) {
                conditionParts.push(
                    `AND ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`
                );
            }

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.Char(8), startDate);
            request.input('EndDate', sql.Char(8), endDate);
            request.input('Condition', sql.VarChar(sql.MAX), condition);
            request.input('Ma_ct', sql.VarChar(8000), ''); // Truyền rỗng như SQL mẫu

            const result = await request.execute('INSO1');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                // condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async tongHopNhapXuatTon({
        ngay_ct1,
        ngay_ct2,
        // tinh_dc,
        ma_vat_tu,
        ma_kho,
        ma_dvcs
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Điều kiện chính
            let condParts: string[] = [];
            condParts.push(`1=1`);

            if (ma_kho?.trim()) {
                condParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vat_tu?.trim()) {
                condParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                condParts.push(`AND ma_dvcs LIKE '${ma_dvcs.trim()}%'`);
            }

            const condition = condParts.join(' ').trim();

            // Điều kiện SD
            let condSDParts: string[] = [];
            condSDParts.push(`1=1`);
            if (ma_kho?.trim()) {
                condSDParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vat_tu?.trim()) {
                condSDParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                condSDParts.push(
                    `AND ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`
                );
            }

            const conditionSD = condSDParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Tinh_dc', sql.Int, 1);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('vttonkho', sql.Char(1), '*');
            request.input('ConditionSD', sql.NVarChar(121), conditionSD);

            const result = await request.execute('INCD1');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                // condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async tongHopNhapXuatTonQuyDoi({
        ngay_ct1,
        ngay_ct2,
        // tinh_dc,
        ma_vat_tu,
        ma_kho,
        ma_dvcs
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Điều kiện chính
            let condParts: string[] = [];
            condParts.push(`1=1`);

            if (ma_kho?.trim()) {
                condParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vat_tu?.trim()) {
                condParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                condParts.push(`AND ma_dvcs LIKE '${ma_dvcs.trim()}%'`);
            }

            const condition = condParts.join(' ').trim();

            // Điều kiện SD
            let condSDParts: string[] = [];
            condSDParts.push(`1=1`);
            if (ma_kho?.trim()) {
                condSDParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vat_tu?.trim()) {
                condSDParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                condSDParts.push(
                    `AND ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`
                );
            }

            const conditionSD = condSDParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Tinh_dc', sql.Int, 1);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('vttonkho', sql.Char(1), '*');
            request.input('ConditionSD', sql.NVarChar(121), conditionSD);

            const result = await request.execute('INCD1B');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                // condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async tongHopChiTietVT({
        ngay_ct1,
        ngay_ct2,
        // tinh_dc,
        ma_vat_tu,
        ma_kho,
        ma_dvcs
    }) {
        try {
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build Condition
            let condParts: string[] = [];
            condParts.push(`1=1`);
            if (ma_dvcs?.trim()) {
                condParts.push(
                    `and ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`
                );
            }
            if (ma_kho?.trim()) {
                condParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vat_tu?.trim()) {
                condParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }
            condParts.push(`AND vt_ton_kho = 1`);
            const condition = condParts.join(' ').trim();

            // Build ConditionSD
            let condSDParts: string[] = [];
            condSDParts.push(`1=1`);
            if (ma_dvcs?.trim()) {
                condSDParts.push(
                    `and ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`
                );
            }
            if (ma_kho?.trim()) {
                condSDParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vat_tu?.trim()) {
                condSDParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }
            const conditionSD = condSDParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Tinh_dc', sql.Int, 1);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);
            request.input('Madvcs', sql.NVarChar(3), ma_dvcs?.trim() || '');
            request.input('ConditionSD', sql.NVarChar(121), conditionSD);

            const result = await request.execute('INCD11');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                // condition // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async baoCaoTonKho({
        ngay_ct2,
        ma_kho,
        ma_vat_tu,
        ma_dvcs
    }) {
        try {
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build dynamic condition
            let conditionParts: string[] = [];
            conditionParts.push('1=1');

            if (ma_kho?.trim()) {
                conditionParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            if (ma_vat_tu?.trim()) {
                conditionParts.push(`AND ma_vt LIKE '${ma_vat_tu.trim()}%'`);
            }

            if (ma_dvcs?.trim()) {
                conditionParts.push(
                    `AND ma_kho IN (SELECT ma_kho FROM dmkho WHERE ma_dvcs LIKE '${ma_dvcs.trim()}%')`
                );
            }

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();
            const filter = ' 1=1 ';
            request.input('Date', sql.VarChar(8), endDate);
            request.input('Filter', sql.NVarChar(5), filter);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            const result = await request.execute('INSD2CK');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                // condition // để debug
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
