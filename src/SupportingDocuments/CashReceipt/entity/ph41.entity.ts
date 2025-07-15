import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ph41')
export class Ph41 {
  @PrimaryColumn()
  stt_rec: string;

  @Column({ length: 10 })
  ma_dvcs: string;

  @Column()
  ma_ct: string;

  @Column()
  ma_gd: string;

  @Column({ type: 'date' })
  ngay_ct: Date;

  @Column({ type: 'date' })
  ngay_lct: Date;

  @Column()
  so_ct: string;

  @Column()
  ma_kh: string;

  @Column({ nullable: true })
  dia_chi: string;

  @Column({ nullable: true })
  ong_ba: string;

  @Column({ nullable: true })
  dien_giai: string;

  @Column()
  tk: string;

  @Column()
  ma_nt: string;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_gia: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  t_tien_nt: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  t_tien: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  t_thue_nt: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  t_thue: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  t_tt_nt: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  t_tt: number;

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
  status: string;

  @Column({ nullable: true })
  loai_ct: string;

  @Column({ nullable: true })
  han_tt: string;

  @Column({ nullable: true })
  ma_qs: string;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  ty_giaf: number;

  @Column({ nullable: true })
  hd_thue: string;

  @Column({ nullable: true })
  sysflag: string;
}
