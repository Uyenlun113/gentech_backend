import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateCashReceiptDto {
  @IsString()
  @IsOptional()
  ma_gd?: string;

  @IsString()
  @IsOptional()
  ma_kh?: string;

  @IsString()
  @IsOptional()
  dia_chi?: string;

  @IsString()
  @IsOptional()
  mst?: string;

  @IsString()
  @IsOptional()
  ong_ba?: string;

  @IsString()
  @IsOptional()
  dien_giai?: string;

  @IsDateString()
  @IsOptional()
  ngay_ct?: Date;

  @IsDateString()
  @IsOptional()
  ngay_lct?: Date;

  @IsString()
  @IsOptional()
  ma_qs?: string;

  @IsString()
  @IsOptional()
  so_ct?: string;

  @IsString()
  @IsOptional()
  ma_nt?: string;

  @IsNumber()
  @IsOptional()
  ty_gia?: number;

  @IsString()
  @IsOptional()
  loai_ct?: string;
}
