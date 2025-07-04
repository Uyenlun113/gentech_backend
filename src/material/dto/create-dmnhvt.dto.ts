import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDmnhvtDto {
    @IsOptional()
    @IsNumber()
    loai_nh: number;

    @IsOptional()
    @IsString()
    ma_nh: string;

    @IsOptional()
    @IsString()
    ten_nh: string;

    @IsOptional()
    @IsString()
    ten_nh2?: string;

    @IsOptional()
    @IsString()
    date0: string;

    @IsOptional()
    @IsString()
    time0: string;

    @IsOptional()
    @IsNumber()
    user_id0: number;

    @IsOptional()
    @IsString()
    user_name0: string;

    @IsOptional()
    @IsString()
    date: string;

    @IsOptional()
    @IsString()
    time: string;

    @IsOptional()
    @IsNumber()
    user_id: number;

    @IsOptional()
    @IsString()
    user_name: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    ma_td1?: string;

    @IsOptional()
    @IsString()
    ma_td2?: string;

    @IsOptional()
    @IsString()
    ma_td3?: string;

    @IsOptional()
    @IsString()
    ngay_td1?: string;

    @IsOptional()
    @IsString()
    ngay_td2?: string;

    @IsOptional()
    @IsString()
    ngay_td3?: string;


}