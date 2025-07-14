import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString, ValidateNested } from 'class-validator';

class PhieuDto {
    @IsNotEmpty() so_ct: string;
    @IsNotEmpty() ma_qs: string;
    @IsNotEmpty() ngay_lct: string;
    @IsOptional() ps_no?: number;
    @IsOptional() ps_co?: number;
    @IsOptional() nh_dk?: string;
    @IsOptional() dien_giai?: string;
    @IsOptional() ty_giaf?: number;
    @IsOptional() status?: string;
    @IsOptional() ngay_ct?: string;
}

class HachToanDto {
    @IsNotEmpty()
    tk_i: string;

    @IsOptional()
    ps_no?: number;

    @IsOptional()
    ps_co?: number;

    @IsOptional()
    nh_dk?: string;

    @IsOptional()
    dien_giaii?: string;

    @IsOptional()
    ma_kh_i?: string;
}

class HopDongThueDto {
    @IsOptional()
    @IsString()
    so_seri0: string;

    @IsOptional()
    @IsString()
    ma_kh: string;

    @IsOptional()
    @IsString()
    ten_kh: string;

    @IsOptional()
    @IsString()
    dia_chi: string;

    @IsOptional()
    @IsString()
    ma_so_thue: string;

    @IsOptional()
    @IsNumberString()
    ty_gia: string;

    @IsOptional()
    @IsString()
    ten_vt: string;

    @IsOptional()
    @IsNumberString()
    t_tien: string;

    @IsOptional()
    @IsNumberString()
    thue_suat: string;

    @IsOptional()
    @IsNumberString()
    t_thue: string;

    @IsOptional()
    @IsNumberString()
    t_tt: string;

    @IsOptional()
    @IsString()
    tk_thue_no: string;

    @IsOptional()
    @IsString()
    tk_du: string;

    @IsOptional()
    @IsString()
    ma_thue: string;

    @IsOptional()
    @IsString()
    ma_ms: string;

    @IsOptional()
    @IsString()
    kh_mau_hd: string;

    @IsOptional()
    @IsString()
    so_ct0: string;

    @IsOptional()
    ngay_ct0: Date;

}

export class SaveGeneralAccountingDto {
    @ValidateNested() @Type(() => PhieuDto)
    phieu: PhieuDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HachToanDto)
    hachToan: HachToanDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HopDongThueDto)
    hopDongThue: HopDongThueDto[];
}
