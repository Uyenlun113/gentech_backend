import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CallStoreDto {
  @IsString()
  store: string;

  @IsString()
  tk: string;

  @IsDateString()
  ngay_ct1: string; // YYYY-MM-DD or ISO

  @IsDateString()
  ngay_ct2: string;

  @IsOptional()
  @IsInt()
  gop_tk?: number; // optional

  @IsString()
  ma_dvcs: string;
}
