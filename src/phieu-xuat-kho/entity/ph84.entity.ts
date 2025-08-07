import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ph84')
export class Ph84 {
  @PrimaryColumn()
  stt_rec: string;

  @Column()
  ma_ct: string;

  @Column()
  ma_gd: string;

  @Column({ type: 'datetime' })
  ngay_ct: Date;

  @Column({ type: 'datetime' })
  ngay_lct: Date;

  @Column()
  so_ct: string;

  @Column()
  ma_kh: string;

  @Column()
  ong_ba: string;

  @Column()
  dia_chi: string;

  @Column()
  dien_giai: string;

  @Column({ type: 'float' })
  t_so_luong: number;

  @Column()
  ma_nt: string;

  @Column({ type: 'float' })
  ty_gia: number;

  @Column({ type: 'float' })
  t_tien_nt: number;

  @Column({ type: 'float' })
  t_tien: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  time: string;

  @Column({ type: 'datetime' })
  date0: Date;

  @Column()
  time0: string;

  // @Column()
  // user_id0: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  sua_tien: number;

  @Column()
  px_gia_dd: number;

  @Column()
  ma_dvcs: string;

  @Column()
  ma_qs: string;

  @Column({ type: 'float' })
  ty_giaf: number;

  // @Column({ nullable: true })
  // row_id: string;

  @Column({ nullable: true })
  hd_thue: string;

  // @Column()
  // sysflag: string;
}