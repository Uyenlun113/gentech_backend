import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    ten_kh: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(255)
    e_mail?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    dien_thoai?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    dia_chi?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    ma_so_thue?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    ma_tra_cuu?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    tk_nh?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    ten_nh?: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    ghi_chu?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    nh_kh1?: string;

    @IsString()
    @IsOptional()
    nh_kh2?: string;

    @IsString()
    @IsOptional()
    nh_kh3?: string;

    @IsString()
    @IsOptional()
    doi_tac?: string;
}
