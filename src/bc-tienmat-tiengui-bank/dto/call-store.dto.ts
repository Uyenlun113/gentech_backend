import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CallStoreDto {
  @IsString()
  store: string;

  @IsString()
  tk: string;

  @IsDateString()
  ngay_ct1: string; // YYYY-MM-DD or ISO

  @IsDateString()
  ngay_ct2: string;

  @IsString()
  gop_tk?: string; // optional

  @IsString()
  ma_dvcs: string;

  @IsString()
  @IsOptional()
  OutputInsert?: string;

  @IsInt()
  @IsOptional()
  stt_rec?: number;
}
