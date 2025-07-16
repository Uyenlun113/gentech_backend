
//   stt_rec?: string;
//   ma_ct?: string;
//   ngay_ct_from?: Date;
//   ngay_ct_to?: Date;
//   so_ct?: string;
//   dien_giai?: string;
//   tk_i?: string;
//   min_tien?: number;
//   max_tien?: number;
  // Thêm các trường khác nếu cần thiết cho việc truy vấn
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryGiayBaoCoDto {
    @IsOptional()
    @IsString()
    search?: string;

    // @IsOptional()
    // @IsString()
    // status?: string;

    // @IsOptional()
    // @IsString()
    // dateFrom?: string;

    // @IsOptional()
    // @IsString()
    // dateTo?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    limit?: number = 10;
}