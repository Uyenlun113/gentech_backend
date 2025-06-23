import { IsOptional, IsString } from 'class-validator';

export class QueryAccountDto {
    @IsOptional()
    @IsString()
    search?: string;
}