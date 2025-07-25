import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateDmkhoDto {
    @IsNotEmpty()
    @IsString()
    ma_kho: string;

    @IsNotEmpty()
    @IsString()
    ten_kho: string;

    @IsOptional()
    @IsString()
    ma_dvcs: string;

    @IsOptional()
    @IsString()
    tk_dl: string;

    @IsOptional()
    @IsString()
    status: string;
}