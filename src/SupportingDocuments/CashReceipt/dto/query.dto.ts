import { IsOptional, IsNumber, IsString } from 'class-validator';

export class QueryCashReceiptDto {
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
