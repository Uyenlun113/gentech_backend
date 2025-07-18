import { IsDateString, IsOptional } from 'class-validator';

export class CreateDmsttDto {
    @IsOptional()
    @IsDateString()
    ngay_dn?: string;

    @IsOptional()
    @IsDateString()
    ngay_ks?: string;

    @IsOptional()
    @IsDateString()
    ngay_ky1?: string;

    @IsOptional()
    @IsDateString()
    ngay_ks_ky?: string;
}
