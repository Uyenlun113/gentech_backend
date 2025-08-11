import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';

// DTO cho ct31
export class HachToanDto {
  @IsString()
  ma_vt: string;

  @IsString()
  ma_kho_i: string;

  @Type(() => Number)
  @IsNumber()
  so_luong: number;

  @Type(() => Number)
  @IsNumber()
  gia2?: number;

  @Type(() => Number)
  @IsNumber()
  tien2?: number;

  @IsOptional()
  gia?: number;

  @IsOptional()
  gia_nt?: number;

  @Type(() => Number)
  @IsNumber()
  tien?: number;

  @IsString()
  tk_dt?: string;

  @IsString()
  tk_vt?: string;

  @IsString()
  tk_gv?: string;
}
// DTO chính cho ph31
export class CreateHoaDonXuatKhoDto {
  @IsString()
  ma_gd: string;

  @IsString()
  ma_kh: string;

  @IsString()
  dia_chi: string;

  @IsString()
  ma_so_thue: string;

  @IsString()
  ong_ba: string;

  @IsString()
  dien_giai: string;

  @IsString()
  ma_nx: string;

  @IsString()
  ma_bp: string;

  @IsDateString()
  ngay_ct: Date;

  @IsDateString()
  ngay_lct: Date;

  @IsString()
  ma_qs: string;

  @IsString()
  so_seri: string;

  @IsString()
  so_ct: string;

  @IsString()
  ma_nt: string;

  @Type(() => Number)
  @IsNumber()
  ty_gia: number;

  // @IsString()
  // status: string;

  // Array lưu vào ct31


  @Type(() => Number)
  @IsNumber()
  sl_in: number;

  @IsString()
  ma_thue: string;

  @Type(() => Number)
  @IsNumber()
  thue_suat: number;

  @IsString()
  tk_thue_co: string;

  @IsString()
  ten_vtthue: string;

  @IsString()
  gc_thue: string;

  @IsString()
  ht_tt: string;

  @IsOptional()
  sua_tien?: number;

  @IsOptional()
  px_gia_dd?: number;

}


export class fullDto {
  @ValidateNested({ each: true })
  @Type(() => CreateHoaDonXuatKhoDto)
  phieu: CreateHoaDonXuatKhoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HachToanDto)
  hangHoa: HachToanDto[];

}