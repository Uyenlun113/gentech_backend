import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateCt85Dto {

    @IsString()
    @IsOptional()
    so_ct?: string;

    @IsDateString()
    @IsOptional()
    ngay_ct?: Date;

    @IsString()
    @IsOptional()
    ma_vt?: string;

    @IsString()
    @IsOptional()
    tk_vt?: string;

    @IsString()
    @IsOptional()
    ma_nx_i?: string;

    @IsNumber()
    @IsOptional()
    so_luong?: number;

    @IsNumber()
    @IsOptional()
    gia_nt?: number;

    @IsNumber()
    @IsOptional()
    tien_nt?: number;
}

export class CreatePh85Dto {
    @IsString()
    @IsOptional()
    ma_qs?: string;

    @IsString()
    @IsOptional()
    ong_ba?: string;

    @IsString()
    @IsOptional()
    dien_giai?: string;

    @IsString()
    @IsOptional()
    ma_kho?: string;

    @IsString()
    @IsOptional()
    ma_khon?: string;

    @IsNumber()
    @IsOptional()
    t_so_luong?: number;

    @IsNumber()
    @IsOptional()
    ty_gia?: number;

    @IsString()
    @IsOptional()
    ma_ct?: string;

    @IsDateString()
    @IsOptional()
    ngay_lct?: Date;

    @IsDateString()
    @IsOptional()
    ngay_ct?: Date;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    so_ct?: string;

    @IsString()
    @IsOptional()
    hd_lenhdd?: string;

    @IsNumber()
    @IsOptional()
    t_tien_nt?: number;
}

export class CreatePh85DtoWithVatTu {
    @ValidateNested()
    @Type(() => CreatePh85Dto)
    phieu: CreatePh85Dto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt85Dto)
    vatTu: CreateCt85Dto[];
}
