import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateMaterialDto {
    @IsString({ message: 'Tên vật tư phải là chuỗi' })
    ten_vt: string;

    @IsOptional()
    dvt?: string;

    @IsOptional()
    @Type(() => Number)
    vt_ton_kho?: number;

    @IsOptional()
    tk_vt?: string;

    @IsOptional()
    tk_gv?: string;

    @IsOptional()
    tk_dt?: string;

    @IsOptional()
    tk_tl?: string;

    @IsOptional()
    tk_spdd?: string;

    @IsOptional()
    nh_vt1?: string;

    @IsOptional()
    nh_vt2?: string;

    @IsOptional()
    gia_ton?: number;

    @IsOptional()
    nh_vt3?: string;

    @IsOptional()
    @Type(() => Number)
    sl_min?: number;

    @IsOptional()
    @Type(() => Number)
    sl_max?: number;

    @IsOptional()
    status?: string;

    @IsOptional()
    @Type(() => Number)
    sua_tk_vt?: number;

    @IsOptional()
    tk_cl_vt?: string;

    @IsOptional()
    tk_dtnb?: string;

    @IsOptional()
    ghi_chu?: string;

    @IsOptional()
    loai_vt?: string;

    @IsOptional()
    tk_nvl?: string;

    @IsOptional()
    tk_ck?: string;

    @IsOptional()
    tk_km?: string;
}