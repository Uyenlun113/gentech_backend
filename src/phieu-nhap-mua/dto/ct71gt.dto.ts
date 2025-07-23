import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCt71GtDto {

    @IsOptional()
    @IsString()
    ma_gd?: string;

    @IsOptional()
    @IsString()
    ma_hd?: string;

    @IsOptional()
    @IsString()
    ma_kho?: string;

    @IsOptional()
    @IsString()
    ten_vt?: string;

    @IsOptional()
    @IsNumber()
    so_luong?: number;

    @IsOptional()
    @IsNumber()
    gia?: number;

    @IsOptional()
    @IsNumber()
    t_thue?: number;

    @IsOptional()
    @IsString()
    so_ct0?: string;

    @IsOptional()
    @IsString()
    so_seri0?: string;

    @IsOptional()
    @IsString()
    ma_kh?: string;

    @IsOptional()
    @IsString()
    ten_kh?: string;

    @IsOptional()
    @IsString()
    ma_dvcs?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    ngay_ct0?: Date;

    @IsOptional()
    @IsString()
    dia_chi?: string;

    @IsOptional()
    @IsString()
    ma_so_thue?: string;

    @IsOptional()
    @IsNumber()
    t_tien?: number;

    @IsOptional()
    @IsNumber()
    thue_suat?: number;

    @IsOptional()
    @IsNumber()
    han_tt?: number;

    @IsOptional()
    @IsNumber()
    t_tt?: number;

    @IsOptional()
    @IsString()
    tk_thue_no?: string;
}
