import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDmhdctDto {

    @IsString()
    ma_kho_i: string;

    @IsOptional()
    @IsString()
    ma_vt?: string;

    @Type(() => Date)
    @IsDate()
    ngay_ct: Date;

    @Type(() => Date)
    @IsDate()
    han_gh_i: Date;

    @IsOptional()
    @IsNumber()
    thue_nt?: number;

    @IsOptional()
    @IsNumber()
    tien_nt2?: number;

    @IsOptional()
    @IsNumber()
    tien_nt?: number;

    @IsOptional()
    @IsNumber()
    gia_nt2?: number;

    @IsOptional()
    @IsNumber()
    gia_nt?: number;

    @IsOptional()
    @IsNumber()
    tl_ck?: number;

    @IsOptional()
    @IsNumber()
    ck_nt?: number;

    @IsOptional()
    @IsNumber()
    thue_suat?: number;

    @IsOptional()
    @IsString()
    tk_vt?: string;

    @IsOptional()
    @IsString()
    ma_thue?: string;

    @IsOptional()
    @IsNumber()
    so_luong?: number;
}
