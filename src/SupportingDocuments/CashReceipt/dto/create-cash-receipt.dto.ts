import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateCashReceiptDto {
  @IsString()
  @IsNotEmpty()
  ma_gd: string;

  @IsString()
  @IsNotEmpty()
  ma_kh: string;

  @IsString()
  @IsNotEmpty()
  dia_chi: string;

  @IsString()
  @IsNotEmpty()
  mst: string;

  @IsString()
  @IsNotEmpty()
  ong_ba: string;

  @IsString()
  @IsNotEmpty()
  dien_giai: string;

  @IsDateString()
  ngay_ct: Date;

  @IsDateString()
  ngay_lct: Date;

  @IsString()
  @IsNotEmpty()
  ma_qs: string;

  @IsString()
  @IsNotEmpty()
  so_ct: string;

  @IsString()
  @IsNotEmpty()
  ma_nt: string;

  @IsNumber()
  ty_gia: number;

  @IsString()
  @IsNotEmpty()
  loai_ct: string;
}
