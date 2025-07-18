import { IsOptional, IsNumber, IsString } from 'class-validator';

export class QueryPhieuNhapKhoDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    limit?: number;
}
