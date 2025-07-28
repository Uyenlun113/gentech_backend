import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateCt21Dto {
    @IsString()
    so_ct: string;

    @IsOptional()
    @IsString()
    ma_vt?: string;

    @IsDateString()
    ngay_ct: Date;

    @IsOptional()
    @IsNumber()
    thue?: number;

    @IsOptional()
    @IsNumber()
    tien_nt2?: number;

    @IsOptional()
    @IsNumber()
    tien2?: number;

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
    thue_suati?: number;

    @IsOptional()
    @IsString()
    tk_dt?: string;

    @IsOptional()
    @IsString()
    ma_thue_i?: string;

    @IsOptional()
    @IsString()
    tk_thue_i?: string;

    @IsOptional()
    @IsString()
    tk_ck?: string;

    @IsOptional()
    @IsString()
    dvt?: string;

    @IsOptional()
    @IsString()
    dien_giaii?: string;

    @IsOptional()
    @IsNumber()
    so_luong?: number;
}

export class CreatePh21Dto {

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
    t_tien_nt2?: number;

    @IsOptional()
    @IsNumber()
    t_thue?: number;

    @IsOptional()
    @IsNumber()
    t_tt_nt?: number;

    @IsOptional()
    @IsNumber()
    t_ck?: number;

    @IsOptional()
    @IsNumber()
    tien_hg_nt?: number;

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

    @IsDateString()
    ngay_ct: Date;

    @IsDateString()
    ngay_lct: Date;

    @IsOptional()
    @IsNumber()
    t_tien2?: number;

    @IsOptional()
    @IsString()
    ma_nx?: string;

    @IsOptional()
    @IsString()
    ten_kh?: string;

    @IsOptional()
    @IsString()
    so_seri?: string;

    @IsOptional()
    @IsString()
    ht_tt?: string;

    @IsNumber()
    @Type(() => Number)
    han_tt?: number;

    @IsOptional()
    @IsString()
    ten_vtthue?: string;

    @IsOptional()
    @IsString()
    ma_thck?: string;
}

export class CreateFullPh21Dto {
    @ValidateNested()
    @Type(() => CreatePh21Dto)
    phieu: CreatePh21Dto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt21Dto)
    hangHoa: CreateCt21Dto[];
}
