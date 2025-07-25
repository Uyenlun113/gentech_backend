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
export class GiayBaoCoItemDto {
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

// DTO chính
export class CreateGiayBaoCoDto {
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
  @Type(() => GiayBaoCoItemDto)
  tai_khoan_list: GiayBaoCoItemDto[];

  @IsNumber()
  tong_tien: number;

  @IsNumber()
  han_thanh_toan: string;
  
  @IsString()
  @IsNotEmpty()
  tk: string;
}