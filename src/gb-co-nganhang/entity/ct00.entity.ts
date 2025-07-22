import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('ct00') // tên bảng trong database
export class Ct00 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stt_rec: string;

  @Column({ nullable: true })
  stt_rec0: string;

  @Column()
  ma_ct: string;

  @Column({ nullable: true })
  ma_gd: string;

  @Column({ type: 'date' })
  ngay_ct: Date;

  @Column({ type: 'date', nullable: true })
  ngay_lct: Date;

  @Column({ nullable: true })
  so_ct: string;

  @Column({ nullable: true })
  ong_ba: string;

  @Column({ nullable: true })
  dien_giai: string;

  @Column({ nullable: true })
  nh_dk: string;

  @Column({ nullable: true })
  tk: string;

  @Column({ nullable: true })
  tk_du: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  ps_no_nt: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  ps_co_nt: number;

  @Column({ nullable: true })
  ma_nt: string;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_gia: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_gia_ht: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_gia_ht2: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  ps_no: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  ps_co: number;

  @Column({ nullable: true })
  ma_kh: string;

  @Column({ nullable: true })
  ct_nxt: number;

  @Column({ nullable: true })
  ma_vv: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  ma_dvcs: string;

  @Column({ nullable: true })
  so_seri0: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ type: 'date', nullable: true })
  date0: Date;

  @Column({ nullable: true })
  time0: string;

  @Column({ nullable: true })
  user_id0: string;

  @Column({ nullable: true })
  loai_ct: string;

  @Column({ nullable: true })
  dien_giai0: string;

  @Column({ nullable: true })
  ma_qs: string;

  @Column({ nullable: true })
  sua_tggs: string;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_giaf: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_gia_htf: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_giahtf2: number;

  @Column({ nullable: true })
  nh_dkc: string;
}
