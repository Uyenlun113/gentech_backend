import { IsOptional, IsString } from 'class-validator';

export class QueryDonhangmuaDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() ma_kh?: string;
  // Thêm các trường filter khác nếu cần
}