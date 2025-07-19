    import { IsOptional, IsString, IsNumber, IsDate, Length } from 'class-validator';
    import { Type } from 'class-transformer';

    export class CdtkDto {
        @IsOptional()
        @IsNumber()
        nam?: number;

        @IsOptional()
        @IsString()
        @Length(0, 16)
        tk?: string;

        @IsOptional()
        @IsNumber()
        du_no00?: number;

        @IsOptional()
        @IsNumber()
        du_co00?: number;

        @IsOptional()
        @IsNumber()
        du_no_nt00?: number;

        @IsOptional()
        @IsNumber()
        du_co_nt00?: number;

        @IsOptional()
        @IsNumber()
        du_no1?: number;

        @IsOptional()
        @IsNumber()
        du_co1?: number;

        @IsOptional()
        @IsNumber()
        du_no_nt1?: number;

        @IsOptional()
        @IsNumber()
        du_co_nt1?: number;

        @IsOptional()
        @Type(() => Date)
        @IsDate()
        date?: Date;

        @IsOptional()
        @IsString()
        @Length(0, 1)
        status?: string;

        @IsOptional()
        @IsString()
        @Length(0, 8)
        ma_dvcs?: string;
    }
