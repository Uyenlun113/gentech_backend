import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IngiaTbDto {
    @IsNumber() Period1: number;
    @IsNumber() Year1: number;
    @IsNumber() Period2: number;
    @IsNumber() Year2: number;

    @IsString() @IsOptional() Ma_kho?: string;
    @IsString() @IsOptional() Ma_dvcs?: string;
    @IsString() @IsOptional() Ma_vt?: string;
    @IsString() @IsOptional() Ma_vv?: string;
    @IsString() @IsOptional() OutMa_vts?: string;
    @IsString() @IsOptional() Tk_vt?: string;
    @IsString() @IsOptional() Nh_vt1?: string;
    @IsString() @IsOptional() Nh_vt2?: string;
    @IsString() @IsOptional() Nh_vt3?: string;
    @IsString() @IsOptional() Nh_sc?: string;
    @IsString() @IsOptional() Dk_cl?: string;
    @IsOptional() Tinh_giatb?: string;
}