import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateDmvuviecDto {
    @IsNotEmpty()
    @IsString()
    ma_vv: string;

    @IsNotEmpty()
    @IsString()
    ten_vv: string;

    @IsOptional()
    @IsString()
    ma_kh: string;

    @IsOptional()
    @IsString()
    ma_bpkd: string;

    @IsOptional()
    @IsString()
    ma_bpth: string;

    @IsOptional()
    @IsNumber()
    tien_nt0: number;

    @IsOptional()
    @IsNumber()
    thue_nt: number;
}
