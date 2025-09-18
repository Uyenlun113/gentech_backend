import { Injectable, BadRequestException } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConfig } from 'src/config/sql.config';
import { formatDateToYYYYMMDD } from 'src/type/date';

@Injectable()
export class BcMuaHangService {
    //main
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
                ma_dvcs,
                ma_kho,
                loai_phieu_nhap,
                ma_kh,
                ma_vt,
                ma_gd,
                ma_tai_khoan,
                tk_du,
                loai_bao_cao,
                ma_hdm,
                hd_tu_ng,
                hd_den_ng,
                ct_tu_ng,
                ct_den_ng,
                chi_phi,
                tu_ngay,
                den_ngay,
                so_ct_tu,
                so_ct_den,
                kieu_bc,
                ghi_no_co,
                ngay_dh1,
                ngay_dh2,
            } = dto;
            let rpData = {}
            switch (configName) {
                case "bang_ke_phieu_nhap":
                    rpData = await this.bangKePhieuNhap({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach: ma_khach || ma_kh,
                        ma_vat_tu: ma_vat_tu || ma_vt,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                        loai_phieu_nhap,
                    });
                    break;

                case "bang_ke_hoa_don_mua_hang_va_dich_vu":
                    rpData = await this.bangKeHoaDonMuaHangDV({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach: ma_khach || ma_kh,
                        chung_tu_tu_so,
                        den_so,
                    });
                    break;

                case "bang_ke_phieu_xuat_tra_lai_nha_cung_cap":
                    rpData = await this.bangKePhieuXuatTraLaiNCC({
                        ngay_ct1,
                        ngay_ct2,
                        ma_khach: ma_khach || ma_kh,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                    });
                    break;

                case "bang_ke_phieu_nhap_cua_mot_mat_hang":
                    rpData = await this.bangKePhieuNhapMotMatHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vt: ma_vat_tu || ma_vt,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                    });
                    break;

                case "bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_nha_cung_cap":
                    rpData = await this.bangKePhieuNhapMotMatHangNhomTheoNCC({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vt: ma_vat_tu || ma_vt,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                        ma_gd,
                    });
                    break;

                case "bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_dang_nhap_mua":
                    rpData = await this.bangKeMotMatHangNhomTheoDangNhapMua({
                        ngay_ct1,
                        ngay_ct2,
                        ma_vt: ma_vat_tu || ma_vt,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                        ma_gd,
                    });
                    break;

                case "bang_ke_phieu_nhap_cua_mot_nha_cung_cap_nhom_theo_mat_hang":
                    rpData = await this.bangKeNCCNhomTheoMatHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_kh: ma_khach || ma_kh,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                    });
                    break;

                case "bao_cao_tong_hop_hang_nhap_mua":
                    rpData = await this.baoCaoTongHopHangNhapMua({
                        ngay_ct1,
                        ngay_ct2,
                        ma_kh: ma_khach || ma_kh,
                        ma_vt: ma_vat_tu || ma_vt,
                        chung_tu_tu_so,
                        den_so,
                        ma_kho,
                    });
                    break;

                case "bang_ke_chung_tu":
                    rpData = await this.bangKeChungTu({
                        ngay_ct1,
                        ngay_ct2,
                        chung_tu_tu_so,
                        den_so,
                        ma_tai_khoan,
                    });
                    break;

                case "bang_ke_chung_tu_theo_nha_cung_cap":
                    rpData = await this.bangKeChungTuNCC({
                        ngay_ct1,
                        ngay_ct2,
                        ma_tai_khoan,
                        chung_tu_tu_so,
                        den_so,
                        loai_bao_cao,
                        ghi_no_co,
                    });
                    break;

                case "tong_hop_so_phat_sinh_theo_nha_cung_cap":
                    rpData = await this.tongHopPhatSinhNCC({
                        ngay_ct1,
                        ngay_ct2,
                        ma_tai_khoan,
                        chung_tu_tu_so,
                        den_so,
                        ghi_no_co,
                    });
                    break;

                case "tra_so_du_cong_no_cua_mot_nha_cung_cap":
                    rpData = await this.traSoDuCongNoNCC({
                        ma_kh,
                        ma_tai_khoan,
                        ngay_ct1,
                        ma_dvcs,
                    });
                    break;

                case "so_chi_tiet_cong_no_cua_mot_nha_cung_cap":
                    rpData = await this.soChiTietCongNoNCC({
                        ma_tai_khoan,
                        ma_kh,
                        ngay_ct1,
                        ngay_ct2,
                    });
                    break;

                case "so_doi_chieu_cong_no":
                    rpData = await this.soDoiChieuCongNo({
                        ngay_ct1,
                        ngay_ct2,
                        ma_kh: ma_khach || ma_kh,
                        ma_tai_khoan,
                        ma_dvcs,
                        kieu_bc,
                    });
                    break;

                case "so_chi_tiet_cong_no_len_tat_ca_nha_cung_cap":
                    rpData = await this.soChiTietCongNo({
                        ma_tai_khoan,
                        ngay_ct1,
                        ngay_ct2,
                        ma_kh: ma_khach || ma_kh,
                        ma_dvcs,
                    });
                    break;

                case "bang_ke_don_hang":
                    rpData = await this.bangKeDonHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_hdm,
                        ma_gd,
                        ma_dvcs,
                        ma_kh: ma_khach || ma_kh,
                        ma_kho,
                        ma_vt: ma_vat_tu || ma_vt,
                    });
                    break;

                case "bao_cao_thuc_hien_don_hang":
                    rpData = await this.baoCaoThucHienDonHang({
                        ngay_dh1,
                        ngay_dh2,
                        ngay_ct1,
                        ngay_ct2,
                        chi_phi,
                        ma_kh: ma_khach || ma_kh,
                        ma_hdm,
                        ma_dvcs,
                        ma_kho,
                    });
                    break;

                case "bao_cao_tinh_hinh_thuc_hien_ke_hoach_don_hang":
                    rpData = await this.baoCaoTinhHinhKeHoachDonHang({
                        ngay_dh1,
                        ngay_dh2,
                        ngay_ct1,
                        ngay_ct2,
                        chi_phi,
                        ma_kh: ma_khach || ma_kh,
                        ma_hdm,
                        ma_dvcs,
                        ma_kho,
                    });
                    break;

                case "so_chi_tiet_don_hang":
                    rpData = await this.soChiTietDonHang({
                        ngay_ct1,
                        ngay_ct2,
                        ma_hdm,
                        ma_tai_khoan,
                        ma_dvcs,
                    });
                    break;

                case "bang_ke_chung_tu_phat_sinh_theo_don_hang":
                    rpData = await this.bangKeChungTuDonHang({
                        ngay_ct1,
                        ngay_ct2,
                        chung_tu_tu_so,
                        den_so,
                        ma_tai_khoan,
                        tk_du,
                        ma_dvcs,
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

    //báo cáo hàng nhập mua
    async bangKePhieuNhap({
        ngay_ct1,
        ngay_ct2,
        ma_khach,
        ma_vat_tu,
        chung_tu_tu_so,
        den_so,
        ma_kho,
        loai_phieu_nhap,
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
    async bangKePhieuNhapMotMatHang({
        ngay_ct1,
        ngay_ct2,
        ma_vt,
        chung_tu_tu_so,
        den_so,
        ma_kho,
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`1=1`);
            conditionParts.push(`and ma_dvcs like 'CTY%'`);
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

            // Mã kho (LIKE)
            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            // Mã giao dịch (theo ví dụ của bạn: chỉ lấy = 1)
            conditionParts.push(`and ma_gd in ('1')`);

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Gán input cho procedure
            request.input('MaVt', sql.NVarChar(5), ma_vt?.trim() || '');
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            // Gọi stored procedure POBK2
            const result = await request.execute('POBK2');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKePhieuNhapMotMatHangNhomTheoNCC({
        ngay_ct1,
        ngay_ct2,
        ma_vt,
        chung_tu_tu_so,
        den_so,
        ma_kho,
        ma_gd,
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`AND nxt = 1`);
            conditionParts.push(`AND ma_dvcs LIKE 'CTY%'`);
            conditionParts.push(`AND LEN(ISNULL(ma_kh,'')) <> 0`);
            conditionParts.push(`AND ngay_ct >= '${startDate}'`);
            conditionParts.push(`AND ngay_ct <= '${endDate}'`);

            // Mã vật tư
            if (ma_vt?.trim()) {
                conditionParts.push(`AND ma_vt LIKE '${ma_vt.trim()}%'`);
            }

            // Mã kho
            if (ma_kho?.trim()) {
                conditionParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            // Số chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`AND so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Số chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`AND so_ct <= '${den_so.trim()}'`);
            }

            // Mã giao dịch
            if (ma_gd?.trim()) {
                conditionParts.push(`AND ma_gd LIKE '${ma_gd.trim()}'`);
            }

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('ngay_ct1', sql.VarChar(8), startDate);
            request.input('ngay_ct2', sql.VarChar(8), endDate);
            request.input('sKey', sql.NVarChar(sql.MAX), condition);
            request.input('pGroup', sql.NVarChar(50), 'ma_kh');

            // Gọi procedure POBK3
            const result = await request.execute('POBK3');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKeMotMatHangNhomTheoDangNhapMua({
        ngay_ct1,
        ngay_ct2,
        ma_vt,
        chung_tu_tu_so,
        den_so,
        ma_kho,
        ma_gd,
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`AND nxt = 1`);
            conditionParts.push(`AND ma_dvcs LIKE 'CTY%'`);
            conditionParts.push(`AND LEN(ISNULL(ma_nx,'')) <> 0`);
            conditionParts.push(`AND ngay_ct >= '${startDate}'`);
            conditionParts.push(`AND ngay_ct <= '${endDate}'`);

            // Mã vật tư
            if (ma_vt?.trim()) {
                conditionParts.push(`AND ma_vt LIKE '${ma_vt.trim()}%'`);
            }

            // Mã kho
            if (ma_kho?.trim()) {
                conditionParts.push(`AND ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            // Số chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`AND so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Số chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`AND so_ct <= '${den_so.trim()}'`);
            }

            // Mã giao dịch
            if (ma_gd?.trim()) {
                conditionParts.push(`AND ma_gd LIKE '${ma_gd.trim()}'`);
            }

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('ngay_ct1', sql.VarChar(8), startDate);
            request.input('ngay_ct2', sql.VarChar(8), endDate);
            request.input('sKey', sql.NVarChar(sql.MAX), condition);
            request.input('pGroup', sql.NVarChar(50), 'ma_nx');

            // Gọi procedure POBK3
            const result = await request.execute('POBK3');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKeNCCNhomTheoMatHang({
        ngay_ct1,
        ngay_ct2,
        ma_kh,
        chung_tu_tu_so,
        den_so,
        ma_kho,
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`AND nxt = 1`);

            // Mã khách hàng (bắt buộc)
            if (ma_kh?.trim()) {
                conditionParts.push(`AND ma_kh = '${ma_kh.trim()}'`);
            }

            // Điều kiện kho thuộc đơn vị cơ sở
            conditionParts.push(
                `AND ma_kho in (select ma_kho from dmkho where ma_dvcs like 'CTY%')`
            );

            // Số chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`AND so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Số chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`AND so_ct <= '${den_so.trim()}'`);
            }

            // Mã kho
            if (ma_kho?.trim()) {
                conditionParts.push(`AND ma_kho like '${ma_kho.trim()}'`);
            }

            // Loại chứng từ cố định
            conditionParts.push(`AND ma_ct in ('PNA','PNG')`);

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('ngay_ct1', sql.VarChar(8), startDate);
            request.input('ngay_ct2', sql.VarChar(8), endDate);
            request.input('sKey', sql.NVarChar(sql.MAX), condition);

            // Gọi procedure POBK4
            const result = await request.execute('POBK4');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async baoCaoTongHopHangNhapMua({
        ngay_ct1,
        ngay_ct2,
        ma_kh,
        ma_vt,
        chung_tu_tu_so,
        den_so,
        ma_kho,
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];

            conditionParts.push(`nxt = 1`);
            conditionParts.push(`and ma_gd = '1'`);
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

            // Mã khách
            if (ma_kh?.trim()) {
                conditionParts.push(`and ma_kh LIKE '${ma_kh.trim()}%'`);
            }

            // Mã vật tư
            if (ma_vt?.trim()) {
                conditionParts.push(`and ma_vt LIKE '${ma_vt.trim()}%'`);
            }

            // Mã kho
            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho LIKE '${ma_kho.trim()}%'`);
            }

            // Mã đơn vị cơ sở
            conditionParts.push(`and ma_dvcs LIKE 'CTY%'`);

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            // Gọi stored procedure Poth1
            const result = await request.execute('Poth1');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    //báo cáo công nợ nhà cung cấp
    async bangKeChungTu({
        ngay_ct1,
        ngay_ct2,
        chung_tu_tu_so,
        den_so,
        ma_tai_khoan,
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            conditionParts.push(`and 1=1`);

            // Chứng từ từ số
            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            // Chứng từ đến số
            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }

            // Tài khoản (LIKE)
            if (ma_tai_khoan?.trim()) {
                conditionParts.push(`and ma_tai_khoan LIKE '${ma_tai_khoan.trim()}%'`);
            }

            // Mã đơn vị cơ sở
            conditionParts.push(`and ma_dvcs LIKE 'CTY'`);

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            // Gọi stored procedure GLBK1
            const result = await request.execute('GLBK1');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async bangKeChungTuNCC({
        ngay_ct1,
        ngay_ct2,
        ma_tai_khoan,
        chung_tu_tu_so,
        den_so,
        loai_bao_cao,
        ghi_no_co, // thêm tham số này
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            if (chung_tu_tu_so?.trim()) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            if (den_so?.trim()) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }

            conditionParts.push(`and ma_dvcs LIKE 'CTY%'`);

            // Thêm điều kiện theo ghi_no_co
            if (ghi_no_co === 1) {
                conditionParts.push(`and ps_no<>0`);
            } else if (ghi_no_co === 2) {
                conditionParts.push(`and ps_co<>0`);
            }
            // ghi_no_co = 0 thì giữ nguyên, không thêm gì cả

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('ngay_ct1', sql.Char(8), startDate);
            request.input('ngay_ct2', sql.Char(8), endDate);
            request.input('tk', sql.VarChar(4), ma_tai_khoan.trim());
            request.input('condition', sql.NVarChar(sql.MAX), condition);
            request.input('groupby', sql.Char(1), loai_bao_cao.trim());
            // Gọi thủ tục động glbk2
            const result = await request.execute('glbk2');
            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async tongHopPhatSinhNCC({
        ngay_ct1,
        ngay_ct2,
        ma_tai_khoan,
        chung_tu_tu_so,
        den_so,
        ghi_no_co, // thêm tham số này
    }) {
        try {
            // Chuyển ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            if (chung_tu_tu_so) {
                conditionParts.push(`and so_ct >= '${chung_tu_tu_so.trim()}'`);
            }

            if (den_so) {
                conditionParts.push(`and so_ct <= '${den_so.trim()}'`);
            }

            conditionParts.push(`and ma_dvcs LIKE 'CTY%'`);
            if (ghi_no_co === 1) {
                conditionParts.push(`and ps_no<>0`);
            } else if (ghi_no_co === 2) {
                conditionParts.push(`and ps_co<>0`);
            }
            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Tham số truyền vào
            request.input('ngay_ct1', sql.Char(8), startDate);
            request.input('ngay_ct2', sql.Char(8), endDate);
            request.input('tk', sql.VarChar(4), ma_tai_khoan.trim());
            request.input('condition', sql.NVarChar(sql.MAX), condition);
            request.input('groupby', sql.Char(1), '3');

            // Thực thi thủ tục glth2
            const result = await request.execute('glth2');

            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async traSoDuCongNoNCC({
        ma_kh,
        ma_tai_khoan,
        ngay_ct1,
        ma_dvcs,
    }) {
        try {
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số đúng với ARSD2
            request.input('ma_kh', sql.VarChar(50), ma_kh?.trim() || '');
            request.input('tk', sql.VarChar(50), ma_tai_khoan?.trim() || '');
            request.input('ngay_ct', sql.VarChar(20), ngay_ct1?.trim() || '');
            request.input('ma_dvcs', sql.VarChar(50), ma_dvcs?.trim() || '');

            // Gọi thủ tục ARSD2
            const result = await request.execute('ARSD2');

            return {
                data: result.recordset || [],
                params: { ma_kh, ma_tai_khoan, ngay_ct1, ma_dvcs }, // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async soChiTietCongNoNCC({
        ma_tai_khoan,
        ma_kh,
        ngay_ct1,
        ngay_ct2,
    }) {
        try {
            // Chuyển ngày về dạng YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số đúng với Proc_ARSO1NCC
            request.input('Tk_cn', sql.Char, ma_tai_khoan?.trim() || '');
            request.input('Ma_kh', sql.Char, ma_kh?.trim() || '');
            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Detail', sql.Int, 0);
            request.input('Ma_dvcs', sql.Char, 'CTY');
            request.input('Condition', sql.NVarChar(sql.MAX), '');

            // Gọi thủ tục
            const result = await request.execute('Proc_ARSO1NCC');

            return {
                data: result.recordset || [],
                params: {
                    ma_tai_khoan,
                    ma_kh,
                    startDate,
                    endDate,
                    detail: 0,
                    ma_dvcs: 'CTY',
                    condition: '', // để debug
                },
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    async soDoiChieuCongNo({
        ngay_ct1,
        ngay_ct2,
        ma_kh,
        ma_tai_khoan,
        ma_dvcs = 'CTY',
        kieu_bc = '1',
    }) {
        try {
            // Đổi format ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện động
            let conditionParts: string[] = [];
            if (ma_kh?.trim()) {
                conditionParts.push(`ma_kh LIKE '${ma_kh.trim()}'`);
            }
            if (ma_tai_khoan?.trim()) {
                conditionParts.push(`tk LIKE '${ma_tai_khoan.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                conditionParts.push(`ma_dvcs LIKE '${ma_dvcs.trim()}%'`);
            }
            const condition = conditionParts.join(' AND ');

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            // Truyền tham số
            request.input('tungay', sql.VarChar(8), startDate);
            request.input('denngay', sql.VarChar(8), endDate);
            request.input('condition', sql.NVarChar(sql.MAX), condition);
            request.input('kieu_bc', sql.NVarChar(1), kieu_bc.trim());

            // Gọi thủ tục ARSO2M
            const result = await request.execute('ARSO2M');

            return {
                data: result.recordset || [],
                condition, // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async soChiTietCongNo({
        ma_tai_khoan,
        ngay_ct1,
        ngay_ct2,
        ma_kh,
        ma_dvcs = 'CTY',
    }) {
        try {
            // Chuyển ngày sang dạng YYYY-MM-DD 00:00:00
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build Advance condition
            let advanceParts: string[] = [];
            advanceParts.push(`1=1`);
            if (ma_kh?.trim()) {
                advanceParts.push(`and ma_kh like '${ma_kh.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                advanceParts.push(`and ma_dvcs like '${ma_dvcs.trim()}%'`);
            }
            const advance = advanceParts.join(' ');

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('Tk', sql.VarChar(10), ma_tai_khoan.trim());
            request.input('Ngay_ct1', sql.VarChar(8), startDate);
            request.input('Ngay_ct2', sql.VarChar(8), endDate);
            request.input('Advance', sql.NVarChar(sql.MAX), advance);

            const result = await request.execute('Arso1t2');

            return {
                data: result.recordset || [],
                advance, // debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }

    //báo cáo đơn hàng
    async bangKeDonHang({
        ngay_ct1,
        ngay_ct2,
        ma_hdm,
        ma_gd,
        ma_dvcs = 'CTY',
        ma_kh,
        ma_kho,
        ma_vt,
    }) {
        try {
            // Đổi format ngày sang YYYYMMDD
            const startDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const endDate = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build điều kiện
            let conditionParts: string[] = [];
            conditionParts.push(`1=1`);

            if (ma_hdm?.trim()) {
                conditionParts.push(`and Ma_hdm LIKE '${ma_hdm.trim()}%'`);
            }
            if (ma_gd?.trim()) {
                conditionParts.push(`and Ma_Gd LIKE '${ma_gd.trim()}%'`);
            }
            if (ma_dvcs?.trim()) {
                conditionParts.push(`and ma_dvcs LIKE '${ma_dvcs.trim()}%'`);
            }
            if (ma_kh?.trim()) {
                conditionParts.push(`and ma_kh LIKE '${ma_kh.trim()}%'`);
            }
            if (ma_kho?.trim()) {
                conditionParts.push(`and ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            if (ma_vt?.trim()) {
                conditionParts.push(`and ma_vt LIKE '${ma_vt.trim()}%'`);
            }

            const condition = conditionParts.join(' ').trim();

            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('StartDate', sql.VarChar(8), startDate);
            request.input('EndDate', sql.VarChar(8), endDate);
            request.input('Condition', sql.NVarChar(sql.MAX), condition);

            const result = await request.execute('POBKHDM');
            return {
                data: result.recordsets[0] || [],
                totals: result.recordsets[1] || [],
                condition, // để debug
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async baoCaoThucHienDonHang({
        ngay_dh1,
        ngay_dh2,
        ngay_ct1,
        ngay_ct2,
        chi_phi = '0',
        ma_kh,
        ma_hdm,
        ma_dvcs = 'CTY',
        ma_kho,
    }) {
        try {
            // Chuẩn hóa ngày
            const hdTuNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_dh1));
            const hdDenNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_dh2));
            const ctTuNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const ctDenNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Điều kiện (khách hàng, hợp đồng…)
            let conditionParts: string[] = ['1=1'];
            if (ma_kh) {
                conditionParts.push(`and ma_kh = '${ma_kh.trim()}'`);
            }
            if (ma_hdm) {
                conditionParts.push(`and ma_hdm = '${ma_hdm.trim()}'`);
            }
            const condition = conditionParts.join(' ');

            // Filter (dvcs, kho…)
            let filterParts: string[] = ['1=1'];
            if (ma_dvcs) {
                filterParts.push(`and ma_dvcs LIKE '${ma_dvcs.trim()}%'`);
            }
            if (ma_kho) {
                filterParts.push(`and ma_kho LIKE '${ma_kho.trim()}%'`);
            }
            const filter = filterParts.join(' ');

            // Kết nối DB
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('hdTuNg', sql.VarChar(8), hdTuNg);
            request.input('hdDenNg', sql.VarChar(8), hdDenNg);
            request.input('ctTuNg', sql.VarChar(8), ctTuNg);
            request.input('ctDenNg', sql.VarChar(8), ctDenNg);
            request.input('chiPhi', sql.Char(1), chi_phi);
            request.input('condition', sql.VarChar(sql.MAX), condition);
            request.input('filter', sql.VarChar(sql.MAX), filter);

            const result = await request.execute('COHDMTH41');

            return {
                data: result.recordset || [],
                totals: result.recordsets[1] || [],
                condition,
                filter,
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async baoCaoTinhHinhKeHoachDonHang({
        ngay_dh1,
        ngay_dh2,
        ngay_ct1,
        ngay_ct2,
        chi_phi = '0',
        ma_kh,
        ma_hdm,
        ma_dvcs = 'CTY',
        ma_kho,
    }) {
        try {
            // Chuẩn hóa ngày
            const hdTuNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_dh1));
            const hdDenNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_dh2));
            const ctTuNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const ctDenNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Điều kiện
            let conditionParts: string[] = ['1=1'];
            if (ma_kh?.trim()) conditionParts.push(`and ma_kh = '${ma_kh.trim()}'`);
            if (ma_hdm?.trim()) conditionParts.push(`and ma_hdm = '${ma_hdm.trim()}'`);
            const condition = conditionParts.join(' ');

            // Filter
            let filterParts: string[] = ['1=1'];
            if (ma_dvcs?.trim()) filterParts.push(`and ma_dvcs like '${ma_dvcs.trim()}%'`);
            if (ma_kho?.trim()) filterParts.push(`and ma_kho like '${ma_kho.trim()}%'`);
            const filter = filterParts.join(' ');

            // DB call
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('hdTuNg', sql.VarChar(8), hdTuNg);
            request.input('hdDenNg', sql.VarChar(8), hdDenNg);
            request.input('ctTuNg', sql.VarChar(8), ctTuNg);
            request.input('ctDenNg', sql.VarChar(8), ctDenNg);
            request.input('chiPhi', sql.Char(1), chi_phi);
            request.input('condition', sql.VarChar(sql.MAX), condition);
            request.input('filter', sql.VarChar(sql.MAX), filter);

            const result = await request.execute('COHDMTH42');

            return {
                data: result.recordset || [],
                condition,
                filter,
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async soChiTietDonHang({
        ngay_ct1,
        ngay_ct2,
        ma_hdm,
        ma_tai_khoan,
        ma_dvcs = 'CTY',
    }) {
        try {
            // Chuẩn hóa ngày sang YYYYMMDD
            const tungay = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const denngay = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build condition
            let conditionParts: string[] = [];
            if (ma_hdm?.trim()) conditionParts.push(`ma_hdm LIKE '${ma_hdm.trim()}%'`);
            if (ma_tai_khoan?.trim()) conditionParts.push(`ma_tai_khoan LIKE '${ma_tai_khoan.trim()}%'`);
            if (ma_dvcs?.trim()) conditionParts.push(`ma_dvcs like '${ma_dvcs.trim()}%'`);
            const condition = conditionParts.length ? conditionParts.join(' AND ') : '1=1';

            // DB call
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('tungay', sql.VarChar(8), tungay);
            request.input('denngay', sql.VarChar(8), denngay);
            request.input('condition', sql.NVarChar(sql.MAX), condition);

            const result = await request.execute('COHDMSO1');

            return {
                data: result.recordset || [],
                condition,
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi: ${error.message}`);
        }
    }
    async bangKeChungTuDonHang({
        ngay_ct1,
        ngay_ct2,
        chung_tu_tu_so,
        den_so,
        ma_tai_khoan,
        tk_du,
        ma_dvcs = 'CTY',
    }) {
        try {
            // Chuẩn hóa ngày
            const ctTuNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct1));
            const ctDenNg = formatDateToYYYYMMDD(parseDDMMYYYY(ngay_ct2));

            // Build condition
            let conditionParts: string[] = ['1=1'];

            if (ma_dvcs?.trim()) {
                conditionParts.push(`and ma_dvcs = '${ma_dvcs.trim()}'`);
            }

            // Điều kiện số chứng từ (dùng padl + fsize như trong proc gốc)
            if (chung_tu_tu_so) {
                conditionParts.push(
                    `and (so_ct >= dbo.padl('${chung_tu_tu_so.trim()}', dbo.fsize('ct00','so_ct'), ' '))`
                );
            }
            if (den_so) {
                conditionParts.push(
                    `and (so_ct <= dbo.padl('${den_so.trim()}', dbo.fsize('ct00','so_ct'), ' '))`
                );
            }

            if (ma_tai_khoan?.trim()) conditionParts.push(`and ma_tai_khoan like '${ma_tai_khoan.trim()}%'`);
            if (tk_du?.trim()) conditionParts.push(`and tk_du like '${tk_du.trim()}%'`);

            const condition = conditionParts.join(' ');

            // DB call
            const pool = await sql.connect(sqlConfig);
            const request = pool.request();

            request.input('ctTuNg', sql.VarChar(8), ctTuNg);
            request.input('ctDenNg', sql.VarChar(8), ctDenNg);
            request.input('condition', sql.VarChar(sql.MAX), condition);

            const result = await request.execute('COHDMBK1');

            return {
                data: result.recordset || [],
                condition, // debug
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
