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

// DTO cho ct31
export class HachToanDto {
  @IsString()
  tk_vt: string;

  @Type(() => Number)
  @IsNumber()
  tien?: number;

  @IsString()
  dien_giaii?: string;
}

// DTO cho ct31gt
export class HopDongThue {
  // @Type(() => Number)
  // @IsNumber()
  // ma_ms: Number;

  @IsString()
  so_ct0: string;

  @IsString()
  so_seri0: string;

  @IsDateString()
  ngay_ct: Date;

  @Type(() => Number)
  @IsNumber()
  thue_suat?: number;

  @Type(() => Number)
  @IsNumber()
  t_tien?: number;

  @Type(() => Number)
  @IsNumber()
  t_thue?: number;

  @IsString()
  tk_thue_no: string;

  @IsString()
  kh_mau_hd: string;

  @IsString()
  ghi_chu?: string;

  @IsString()
  ten_vt?: string;

  @IsString()
  ma_kh: string;

  @IsString()
  ten_kh: string;

  @IsString()
  ma_thue: string;

  @IsString()
  ma_ms: string;

  @IsString()
  dia_chi: string;

  @IsString()
  ma_so_thue: string;

}

// DTO chính cho ph31
export class CreateHoaDonMuaDVDto {
  @IsString()
  ma_kh: string;

  @IsString()
  dia_chi: string;

  @IsString()
  ong_ba: string;

  @IsString()
  dien_giai: string;

  @IsString()
  ma_nx: string;

  @IsDateString()
  ngay_ct: Date;

  @IsDateString()
  ngay_lct: Date;

  @IsString()
  ma_qs: string;

  @IsString()
  so_ct: string;

  @IsString()
  ma_nt: string;

  @IsNumber()
  ty_gia: number;

  // @IsString()
  // status: string;

  // Array lưu vào ct31
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HachToanDto)
  hachToanList: HachToanDto[];

  // Array lưu vào ct31gt
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HopDongThue)
  hopDongThue: HopDongThue[];
}