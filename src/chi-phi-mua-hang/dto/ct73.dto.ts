import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCt73Dto {
    @IsString()
    ma_kho_i: string;

    @IsOptional()
    @IsString()
    ma_vt?: string;

    @Type(() => Date)
    @IsDate()
    ngay_ct: Date;

    @IsOptional()
    @IsNumber()
    gia?: number;

    @IsOptional()
    @IsNumber()
    thue_nt?: number;

    @IsOptional()
    @IsNumber()
    tien_nt?: number;

    @IsOptional()
    @IsNumber()
    tien_nt0?: number;

    @IsOptional()
    @IsNumber()
    cp_nt?: number;

    @IsOptional()
    @IsNumber()
    cp?: number;

    @IsOptional()
    @IsString()
    tk_vt?: string;

    @IsOptional()
    @IsNumber()
    so_luong?: number;
}
