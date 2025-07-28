import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ph81')
export class Ph81 {
  @PrimaryColumn()
  stt_rec: string;

  @Column()
  ma_gd: string;

  @Column()
  ma_kh: string;

  @Column()
  dia_chi: string;

  @Column()
  ma_so_thue: string;

  @Column()
  ong_ba: string;

  @Column({ nullable: true })
  dien_giai: string;

  @Column()
  ma_nx: string;

  @Column()
  ma_bp: string;

  @Column({ type: 'date' })
  ngay_ct: Date;

  @Column({ type: 'date' })
  ngay_lct: Date;

  @Column()
  ma_qs: string;

  @Column()
  so_seri: string;

  @Column()
  so_ct: string;

  @Column()
  ma_nt: string;

  @Column('float', { nullable: true })
  ty_gia: number;

  @Column()
  sl_in: number;

  @Column()
  ma_thue: string;

  @Column('float', { nullable: true })
  thue_suat: number;

  @Column()
  tk_thue_no: string;

  @Column()
  tk_thue_co: string;

  @Column()
  t_so_luong: number;

  @Column()
  ten_vtthue: string;

  @Column()
  gc_thue: string;

  @Column()
  ht_tt: string;

  @Column()
  t_tien: number;

  @Column()
  t_thue: number;

  @Column()
  t_tt: number;
}
