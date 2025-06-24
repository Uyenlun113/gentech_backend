import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

class PhieuDto {
    @IsNotEmpty() ma_ct: string;
    @IsNotEmpty() ngay_lct: string;
    @IsOptional() ps_no?: number;
    @IsOptional() ps_co?: number;
    @IsOptional() nh_dk?: string;
    @IsOptional() dien_giai?: string;
    @IsOptional() ty_giaf?: number;
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
}

class HopDongThueDto {
    @IsOptional()
    so_seri0: string;

    @IsOptional()
    ma_kh: string;

    @IsOptional()
    ten_kh?: string;
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
