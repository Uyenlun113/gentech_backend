import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

// DTO cho từng item trong array
export class PhieuXuatKhoItemDto {
  @IsString()
  @IsNotEmpty()
  ma_vt: string;

  @IsString()
  // @IsNotEmpty()
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

  @IsString()
  dien_giai: string;
}

// DTO chính
export class CreatePhieuXuatKhoDto {
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

  @IsOptional()
  sua_tien?: number;

  @IsOptional()
  px_gia_dd?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhieuXuatKhoItemDto)
  hang_hoa_list: PhieuXuatKhoItemDto[];
}