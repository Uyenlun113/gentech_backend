import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsNumber,
    IsArray,
    ValidateNested,
    IsDefined
} from 'class-validator';
import { Type } from 'class-transformer';

export class HangHoaItemDto {
    @IsString()
    @IsNotEmpty()
    ma_vt: string;

    @IsString()
    ten_vt: string;

    @IsNumber()
    // @IsNotEmpty()
    tien_nt0: number;

    @IsString()
    ma_thue: string;

    @IsNumber()
    thue_suat: number;

    @IsNumber()
    thue: number;

    @IsString()
    ma_kho_i: string;

    @IsNumber()
    so_luong: number;

    @IsNumber()
    gia0: number;

    @IsNumber()
    gia_nt0: number;

    @IsNumber()
    cp_nt: number;

    @IsNumber()
    cp: number;

    @IsNumber()
    tien0: number;

    @IsNumber()
    tien: number;

    @IsNumber()
    tien_nt: number;

    @IsString()
    tk_vt: string;

    @IsNumber()
    gia: number;

    @IsNumber()
    gia_nt: number;
}
// DTO chính
export class CreateDonHangMuaDto {
    @IsString()
    @IsNotEmpty()
    ma_kh: string;

    @IsString()
    @IsDefined()
    dia_chi: string;

    @IsString()
    @IsDefined()
    ong_ba: string;

    @IsString()
    @IsNotEmpty()
    dien_giai: string;

    @IsDateString()
    ngay_ky: Date;

    @IsString()
    @IsNotEmpty()
    ma_hdm: string;

    @IsString()
    ma_hdm_me: string;

    @IsString()
    @IsNotEmpty()
    ma_nt: string;

    @IsNumber()
    ty_gia: number;

    // @IsNumber()
    // tien_nt0: number;

    // @IsString()
    // ma_thue: string;

    // Array của các tài khoản
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HangHoaItemDto)
    hang_hoa_list: HangHoaItemDto[];

    @IsNumber()
    t_cp: number;

    @IsString()
    @IsNotEmpty()
    loai_ct: string;

    @IsString()
    ma_nx: string;

    @IsString()
    so_ct: string;
}