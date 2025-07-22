import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCdvtDto {
    @IsNumber()
    nam: number;

    @IsString()
    ma_kho: string;

    @IsString()
    ma_vt: string;

    @IsOptional()
    @IsNumber()
    ton00?: number;

    @IsOptional()
    @IsNumber()
    du00?: number;

    @IsOptional()
    @IsNumber()
    du_nt00?: number;
}
