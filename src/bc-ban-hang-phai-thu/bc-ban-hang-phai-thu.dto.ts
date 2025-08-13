import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CallStoreDto {
    @IsOptional()
    StartDate: string;

    @IsOptional()
    EndDate: string;

    @IsOptional()
    @IsString()
    so_ct_from?: string;

    @IsOptional()
    @IsString()
    so_ct_to?: string;

    @IsOptional()
    @IsString()
    ma_kh?: string;

    @IsOptional()
    @IsString()
    ma_kho?: string;

    @IsOptional()
    @IsString()
    ma_vt?: string;

    @IsOptional()
    @IsString()
    ma_dvcs?: string;

    @IsOptional()
    @IsString()
    ma_gd?: string;

    @IsOptional()
    @IsString()
    methodName?: string;

    @IsOptional()
    @IsString()
    pListVoucher: string = 'HDA;HDX';

    @IsOptional()
    @IsInt()
    @Min(0)
    kindFilter: number = 0;
}