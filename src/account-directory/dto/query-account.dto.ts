import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAccountDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Page phải là số' })
    @Min(1, { message: 'Page phải lớn hơn 0' })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit phải là số' })
    @Min(1, { message: 'Limit phải lớn hơn 0' })
    limit?: number = 10;

    @IsOptional()
    @IsString({ message: 'Search phải là chuỗi' })
    search?: string;

    @IsOptional()
    @IsString({ message: 'Loại tài khoản phải là chuỗi' })
    loai_tk?: string;

    @IsOptional()
    @IsString({ message: 'Tài khoản mẹ phải là chuỗi' })
    tk_me?: string;
}

