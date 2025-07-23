import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('dmhdm')
export class Dmhdm {
  // @PrimaryGeneratedColumn('uuid')
  // row_id: string;

  @PrimaryColumn() stt_rec: string;
  @Column() so_ct: string;
  @Column() ma_hdm: string;
  @Column() ma_hdm_me: string;
  @Column() so_hd: string;
  @Column() ma_kh: string;
  @Column({ type: 'date' }) ngay_ky: Date;
  @Column() dien_giai: string;
  @Column() ma_ct: string;
  @Column() status: string;
  @Column() ma_nt: string;
  @Column({ type: 'date' }) date: Date;
  @Column() time: string;
  @Column() user_id: string;
  @Column({ type: 'date' }) date0: Date;
  @Column() time0: string;
  @Column() user_id0: string;
  @Column({ type: 'date' }) ngay_ct: Date;
  @Column({ type: 'date' }) ngay_lct: Date;
  @Column() loai_ct: string;
  @Column('float') t_so_luong: number;
  @Column('float') t_tien_nt: number;
  @Column('float') t_tien: number;
  @Column('float') sua_tien: number;
  @Column('float') t_cp_nt: number;
  @Column('float') t_cp: number;
  @Column() ma_nx: string;
  @Column() ma_dvcs: string;
  @Column() ma_qs: string;
  @Column() ma_gd: string;
  @Column('float') ty_gia: number;
  @Column('float') t_tien_nt0: number;
  @Column('float') t_tien0: number;
  @Column('float') t_thue_nt: number;
  @Column('float') t_thue: number;
  @Column('float') t_tt_nt: number;
  @Column('float') t_tt: number;
  @Column('float') ty_giaf: number;
  @Column() ong_ba: string;
  @Column() dia_chi: string;
  @Column() search: string;
  @Column() hd_thue: string;
  @Column() sysflag: string;
}