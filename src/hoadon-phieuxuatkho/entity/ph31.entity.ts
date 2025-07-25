import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ph31')
export class Ph31 {
  @PrimaryColumn()
  stt_rec: string;

  @Column()
  ma_ct: string;

  @Column()
  ma_dvcs: string;

  @Column({ type: 'date' })
  ngay_ct: Date;

  @Column({ type: 'date' })
  ngay_ct0: Date;

  @Column({ type: 'date' })
  ngay_lct: Date;

  @Column()
  so_ct: string;

  @Column()
  so_ct0: string;

  @Column({ nullable: true })
  dien_giai: string;

  @Column()
  ma_kh: string;

  @Column()
  ong_ba: string;

  @Column()
  dia_chi: string;

  @Column()
  ma_nx: string;

  @Column()
  ma_nt: string;

  @Column()
  ty_gia: number;

  @Column('float', { nullable: true })
  t_tien_nt: number;

  @Column('float', { nullable: true })
  t_tien: number;

  @Column('float', { nullable: true })
  t_thue_nt: number;

  @Column('float', { nullable: true })
  t_thue: number;

  @Column('float', { nullable: true })
  t_tt_nt: number;

  @Column('float', { nullable: true })
  t_tt: number;

  @Column()
  so_seri0: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'date', nullable: true })
  date0: Date;

  @Column({ nullable: true })
  time: string;

  // @Column({ nullable: true })
  // status: string;

  @Column({ nullable: true })
  ma_qs: string;

  @Column('float', { nullable: true })
  ty_giaf: number;
}
