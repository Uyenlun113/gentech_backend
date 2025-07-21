import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateCt85Dto {
    @IsString()
    stt_rec: string;

    @IsString()
    @IsOptional()
    ma_ct?: string;

    @IsString()
    @IsOptional()
    so_ct?: string;

    @IsString()
    @IsOptional()
    ma_qs?: string;

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

    @IsString()
    @IsOptional()
    so_luong?: string;
}

export class CreatePh85Dto {
    @IsString()
    stt_rec: string;

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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt85Dto)
    ct85List: CreateCt85Dto[];
}
