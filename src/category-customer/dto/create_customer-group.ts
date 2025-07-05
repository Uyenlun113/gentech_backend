import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCustomerGroupDto {
    @IsNumber()
    @IsOptional()
    loai_nh: number

    @IsString()
    @IsOptional()
    ma_nh: string

    @IsString()
    @IsOptional()
    ten_nh: string

}