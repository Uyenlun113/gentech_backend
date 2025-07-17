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
export class GiayBaoNoItemDto {
  @IsString()
  @IsNotEmpty()
  tk_i: string;

  @IsString()
  @IsNotEmpty()
  tk_me: string;

  // @IsString()
  // @IsNotEmpty()
  // ten_tai_khoan: string;

  @IsNumber()
  ps_co: number;

  @IsString()
  @IsNotEmpty()
  dien_giai: string;
}
export class HachToanDto {
  @IsString()
  so_ct0?: string;

  @IsString()
  ma_ms?: string;

  @IsString()
  kh_mau_hd?: string;

  @IsString()
  so_seri0?: string;

  @IsDateString()
  ngay_ct?: string; // dạng ISO 8601: "2025-07-17T00:00:00.000Z"

  @IsString()
  ma_kh?: string;

  @IsString()
  ten_kh?: string;

  @IsString()
  dia_chi?: string;

  @IsString()
  ma_so_thue?: string;

  @IsString()
  ten_vt?: string;

  @Type(() => Number)
  @IsNumber()
  t_tien?: number;

  @IsString()
  ma_thue?: string;

  @Type(() => Number)
  @IsNumber()
  thue_suat?: number;

  @Type(() => Number)
  @IsNumber()
  t_thue?: number;

  @IsString()
  tk_thue_no?: string;

  @IsString()
  tk_du?: string;

  @Type(() => Number)
  @IsNumber()
  t_tt?: number;
}
// DTO chính
export class CreateGiayBaoNoDto {
  @IsString()
  @IsNotEmpty()
  ma_gd: string;

  @IsString()
  @IsNotEmpty()
  ma_kh: string;

  @IsString()
  @IsDefined()
  dia_chi: string;

  // @IsString()
  // @IsNotEmpty()
  // mst: string;

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

  // Array của các tài khoản
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GiayBaoNoItemDto)
  tai_khoan_list: GiayBaoNoItemDto[];

  // Array của các tài khoản
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HachToanDto)
  hopDongThue: HachToanDto[];

  @IsNumber()
  tong_tien: number;

  @IsNumber()
  han_thanh_toan: string;

  @IsString()
  @IsNotEmpty()
  tk: string;
}