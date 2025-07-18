import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDefined
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho từng item trong array
export class PhieuNhapKhoItemDto {
  @IsString()
  @IsNotEmpty()
  ma_vt: string;

  @IsString()
  @IsNotEmpty()
  ma_kho_i: string;

  @IsNotEmpty()
  @Type(() => Number)
  so_luong: Number;

  @IsNumber()
  gia: number;

  @IsNumber()
  tien: number;

  @IsNumber()
  @Type(() => Number)
  tk_vt: number;

  @IsNumber()
  @Type(() => Number)
  ma_nx_i: number;
}

// DTO chính
export class CreatePhieuNhapKhoDto {
  @IsString()
  @IsNotEmpty()
  ma_gd: string;

  @IsString()
  @IsNotEmpty()
  ma_kh: string;

  @IsString()
  @IsDefined()
  dia_chi: string;

  @IsString()
  @IsDefined()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhieuNhapKhoItemDto)
  hang_hoa_list: PhieuNhapKhoItemDto[];
}