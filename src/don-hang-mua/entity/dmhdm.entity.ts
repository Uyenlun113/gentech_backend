import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('dmhdm')
export class Dmhdm {
  @PrimaryColumn() stt_rec: string;
  @Column() so_ct: string;
  @Column() ma_hdm: string;
  @Column({ nullable: true }) ma_hdm_me: string;
  @Column({ nullable: true }) so_hd: string;
  @Column() ma_kh: string;
  @Column({ type: 'date' }) ngay_ky: Date;
  @Column() dien_giai: string;
  @Column({ nullable: true }) ma_ct: string;
  @Column({ nullable: true }) status: string;
  @Column() ma_nt: string;
  @Column({ type: 'date', nullable: true }) date: Date;
  @Column({ nullable: true }) time: string;
  @Column({ nullable: true }) user_id: string;
  @Column({ type: 'date', nullable: true }) date0: Date;
  @Column({ nullable: true }) time0: string;
  @Column({ nullable: true }) user_id0: string;
  @Column({ type: 'date', nullable: true }) ngay_ct: Date;
  @Column({ type: 'date', nullable: true }) ngay_lct: Date;
  @Column({ nullable: true }) loai_ct: string;

  @Column('float', { nullable: true }) t_so_luong: number;
  @Column('float', { nullable: true }) t_tien_nt: number;
  @Column('float', { nullable: true }) t_tien: number;
  @Column('float', { nullable: true }) sua_tien: number;
  @Column('float', { nullable: true }) t_cp_nt: number;
  @Column('float', { nullable: true }) t_cp: number;

  @Column({ nullable: true }) ma_nx: string;
  @Column({ nullable: true }) ma_dvcs: string;
  @Column({ nullable: true }) ma_qs: string;
  @Column({ nullable: true }) ma_gd: string;

  @Column('float') ty_gia: number;
  @Column('float', { nullable: true }) t_tien_nt0: number;
  @Column('float', { nullable: true }) t_tien0: number;
  @Column('float', { nullable: true }) t_thue_nt: number;
  @Column('float', { nullable: true }) t_thue: number;
  @Column('float', { nullable: true }) t_tt_nt: number;
  @Column('float', { nullable: true }) t_tt: number;
  @Column('float', { nullable: true }) ty_giaf: number;

  @Column() ong_ba: string;
  @Column({ nullable: true }) dia_chi: string;
  @Column({ nullable: true }) search: string;
  @Column({ nullable: true }) hd_thue: string;
  @Column({ nullable: true }) sysflag: string;
}
