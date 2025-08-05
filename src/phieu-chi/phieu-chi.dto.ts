import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class PhieuCt46Dto {
    @IsNotEmpty()
    @IsString()
    so_ct: string;

    @IsNotEmpty()
    @IsString()
    ma_kh: string;

    @IsOptional()
    @Type(() => Date)
    ngay_ct?: Date;

    @IsNotEmpty()
    @IsString()
    ma_gd: string;

    @IsNotEmpty()
    @IsString()
    ngay_lct: string;

    @IsNotEmpty()
    @IsString()
    tk: string;

    @IsNotEmpty()
    @IsString()
    ma_nt: string;

    @IsOptional()
    @IsString()
    dia_chi?: string;

    @IsOptional()
    @IsString()
    ong_ba?: string;

    @IsOptional()
    @IsString()
    dien_giai?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 1;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    ty_gia?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_tien_nt?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_tien?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_thue_nt?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_thue?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_tt_nt?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_tt?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    loai_ct?: string;

    @IsOptional()
    @IsString()
    han_tt?: string;

    @IsOptional()
    @IsString()
    ma_qs?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 1;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    ty_giaf?: number;

    @IsOptional()
    @IsString()
    hd_thue?: string;

    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    time?: string;

    @IsOptional()
    date?: Date;

    @IsOptional()
    @IsString()
    user_id0?: string;

    @IsOptional()
    @IsString()
    time0?: string;

    @IsOptional()
    date0?: Date;
}

class HachToanCt46Dto {
    @IsNotEmpty()
    @IsString()
    tk_i: string;

    @IsNotEmpty()
    @IsString()
    so_ct0: string;

    @IsOptional()
    @IsString()
    dien_giaii?: string;

    @IsOptional()
    @Type(() => Date)
    ngay_ct?: Date;

    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    tien?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    thue_suat?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    thue?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    tt?: number;

    @IsOptional()
    @IsString()
    tk_thue_i?: string;

    @IsOptional()
    @IsString()
    loai_hd?: string;

    @IsOptional()
    @IsString()
    ma_ms?: string;

    @IsOptional()
    @IsString()
    kh_mau_hd?: string;

    @IsOptional()
    @IsString()
    ma_kh_t?: string;

    @IsOptional()
    @IsString()
    so_seri0?: string;

    @IsOptional()
    @IsString()
    ten_kh_t?: string;

    @IsOptional()
    @IsString()
    dia_chi_t?: string;

    @IsOptional()
    @IsString()
    mst_t?: string;

    @IsOptional()
    @IsString()
    ten_vt_t?: string;

    @IsOptional()
    @IsString()
    ma_thue_i?: string;

    @IsOptional()
    @IsString()
    ghi_chu_t?: string;
}

class HopDongThueCt46Dto {
    @IsOptional()
    @IsString()
    so_ct0?: string;

    @IsOptional()
    @Type(() => Date)
    ngay_ct?: Date;

    @IsOptional()
    @IsString()
    tk_thue_no?: string;

    @IsOptional()
    @IsString()
    ma_ms?: string;

    @IsOptional()
    @IsString()
    kh_mau_hd?: string;

    @IsOptional()
    @IsString()
    ma_kh?: string;

    @IsOptional()
    @IsString()
    so_seri0?: string;

    @IsOptional()
    @IsString()
    ten_kh?: string;

    @IsOptional()
    @IsString()
    dia_chi?: string;

    @IsOptional()
    @IsString()
    ma_so_thue?: string;

    @IsOptional()
    @IsString()
    ten_vt?: string;

    @IsOptional()
    @IsString()
    ma_thue?: string;

    @IsOptional()
    @IsString()
    ghi_chu?: string;

    // Các trường numeric - nhận số từ frontend, validate as number
    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    thue_suat?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_thue?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_tien?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return 0;
        return typeof value === 'string' ? parseFloat(value) : value;
    })
    @IsNumber()
    t_tt?: number;
}

export class SaveCt46AccountingDto {
    @ValidateNested()
    @Type(() => PhieuCt46Dto)
    phieu: PhieuCt46Dto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HachToanCt46Dto)
    hachToan: HachToanCt46Dto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HopDongThueCt46Dto)
    hopDongThue: HopDongThueCt46Dto[];
}