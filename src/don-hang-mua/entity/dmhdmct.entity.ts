import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmhdmct')
export class Dmhdmct {
  @PrimaryColumn({ length: 11 })
  stt_rec: string;

  @PrimaryColumn({ length: 3 })
  stt_rec0: string;

  @Column({ length: 3 })
  ma_ct: string;

  @Column({ type: 'smalldatetime' })
  ngay_ct: Date;

  @Column({ length: 12 })
  so_ct: string;

  @Column({ length: 16 })
  ma_kho_i: string;

  @Column({ length: 16 })
  ma_vv_i: string;

  @Column({ length: 16 })
  ma_vt: string;

  @Column({ length: 16 })
  tk_vt: string;

  @Column('decimal', { precision: 13, scale: 3 })
  so_luong: number;

  @Column('decimal', { precision: 15, scale: 4 })
  gia_nt: number;

  @Column('decimal', { precision: 15, scale: 4 })
  gia: number;

  @Column('decimal', { precision: 16, scale: 2 })
  tien_nt: number;

  @Column('decimal', { precision: 16, scale: 2 })
  tien: number;

  @Column('decimal', { precision: 15, scale: 4 })
  gia_nt0: number;

  @Column('decimal', { precision: 15, scale: 4 })
  gia0: number;

  @Column('decimal', { precision: 16, scale: 2 })
  tien_nt0: number;

  @Column('decimal', { precision: 16, scale: 2 })
  tien0: number;

  @Column('decimal', { precision: 16, scale: 2 })
  cp_nt: number;

  @Column('decimal', { precision: 16, scale: 2 })
  cp: number;

  @Column('decimal', { precision: 16, scale: 2 })
  nk_nt: number;

  @Column('decimal', { precision: 16, scale: 2 })
  nk: number;

  @Column('decimal', { precision: 16, scale: 2 })
  thue_nt: number;

  @Column('decimal', { precision: 16, scale: 2 })
  thue: number;

  @Column({ length: 16 })
  ma_td_i: string;

  @Column({ length: 11 })
  stt_rec_px: string;

  @Column({ length: 3 })
  stt_rec0px: string;

  @Column({ length: 16 })
  ma_td2_i: string;

  @Column({ length: 16 })
  ma_td3_i: string;

  @Column('decimal', { precision: 16, scale: 2 })
  sl_td1_i: number;

  @Column('decimal', { precision: 16, scale: 2 })
  sl_td2_i: number;

  @Column('decimal', { precision: 16, scale: 2 })
  sl_td3_i: number;

  @Column({ type: 'nvarchar', length: 24 })
  gc_td1_i: string;

  @Column({ type: 'nvarchar', length: 24 })
  gc_td2_i: string;

  @Column({ type: 'nvarchar', length: 24 })
  gc_td3_i: string;

  @Column({ length: 16 })
  tk_thue_i: string;

  @Column({ length: 16 })
  ma_sp: string;

  @Column('decimal', { precision: 13, scale: 3 })
  sl_sp: number;

  @Column({ length: 16 })
  ma_phi_i: string;

  @Column({ length: 16 })
  so_lsx_i: string;

  @Column({ length: 16 })
  so_dh_i: string;

  @Column({ length: 16 })
  lot_nbr: string;

  @Column({ length: 2 })
  ma_nvhh: string;

  @Column({ length: 8 })
  loc_id: string;

  @Column({ type: 'nvarchar', length: 16 })
  dvt2: string;

  @Column('decimal', { precision: 13, scale: 3 })
  so_luong2: number;

  @Column({ length: 16 })
  ma_bpht_i: string;

  @Column({ length: 16 })
  ma_hd_i: string;

  @Column({ length: 16 })
  ma_ku_i: string;

  @Column({ type: 'nvarchar', length: 32 })
  gc_s1_i: string;

  @Column({ type: 'nvarchar', length: 32 })
  gc_s2_i: string;

  @Column('decimal', { precision: 15, scale: 3 })
  sl_s1_i: number;

  @Column('decimal', { precision: 15, scale: 3 })
  sl_s2_i: number;

  @Column({ length: 16 })
  ma_s1_i: string;

  @Column({ length: 16 })
  ma_s2_i: string;

  @Column({ type: 'nvarchar', length: 64 })
  gc0_i: string;

  @Column({ length: 8 })
  ma_ns_i: string;

  @Column({ length: 16 })
  ma_tb_i: string;

  @Column({ length: 16 })
  ma_hdm_i: string;

  @Column('decimal', { precision: 6, scale: 2 })
  ts_nk: number;

  @Column('decimal', { precision: 6, scale: 2 })
  ts_db: number;

  @Column('decimal', { precision: 16, scale: 2 })
  db: number;

  @Column('decimal', { precision: 16, scale: 2 })
  db_nt: number;

  @Column({ length: 16 })
  so_ct_tc: string;

  @Column({ length: 16 })
  ma_px_i: string;

  @Column('decimal', { precision: 3, scale: 0 })
  stt_dong: number;

  @Column('decimal', { precision: 1, scale: 0 })
  sua_tk_vt: number;

  @Column({ length: 16 })
  ma_thue: string;

  @Column('decimal', { precision: 6, scale: 2 })
  thue_suat: number;
}
