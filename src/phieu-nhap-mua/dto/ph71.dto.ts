import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePh71Dto {

    @IsString()
    ma_kh: string;

    @IsOptional()
    @IsString()
    dia_chi?: string;

    @IsOptional()
    @IsString()
    ma_so_thue?: string;

    @IsOptional()
    @IsString()
    dien_giai?: string;

    @IsOptional()
    @IsString()
    ma_qs?: string;

    @IsOptional()
    @IsNumber()
    t_so_luong?: number;

    @IsOptional()
    @IsNumber()
    t_tien_nt?: number;

    @IsOptional()
    @IsNumber()
    t_tien_nt0?: number;

    @IsOptional()
    @IsNumber()
    t_cp_nt?: number;

    @IsOptional()
    @IsNumber()
    t_thue?: number;

    @IsOptional()
    @IsNumber()
    t_tt_nt?: number;

    @IsOptional()
    @IsString()
    tk_thue_no?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    ma_dvcs?: string;

    @IsOptional()
    @IsString()
    so_ct?: string;

    @IsOptional()
    @IsString()
    ong_ba?: string;

    @IsOptional()
    @IsString()
    loai_pb?: string;

    @Type(() => Date)
    @IsDate()
    ngay_ct: Date;

    @Type(() => Date)
    @IsDate()
    ngay_lct: Date;
}
