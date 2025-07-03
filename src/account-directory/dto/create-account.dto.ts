import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
    @IsNotEmpty({ message: 'Mã tài khoản không được để trống' })
    tk0: string;

    @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
    ten_tk: string;

    @IsOptional()
    tk_me?: string;

    @IsOptional()
    ma_nt?: string;

    @IsOptional()
    nh_tk?: string;
}
