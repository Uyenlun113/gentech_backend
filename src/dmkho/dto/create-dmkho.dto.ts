import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDmkhoDto {

    @IsString()
    @IsNotEmpty()
    ma_kho: string

    @IsString()
    @IsNotEmpty()
    ten_kho: string

    @IsString()
    @IsOptional()
    ma_dvcs: string

    @IsString()
    @IsOptional()
    tk_dl: string

    @IsString()
    @IsOptional()
    status: string

}