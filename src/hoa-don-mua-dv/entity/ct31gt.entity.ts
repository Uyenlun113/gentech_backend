import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ct31gt') // Tên bảng trong database
export class Ct31gt {
  @Column()
  stt_rec: string;

  @PrimaryColumn()
  stt_rec0: string;

  @Column()
  ma_ct: string;

  @Column({ type: 'date' })
  ngay_ct: Date;

  @Column()
  so_ct: string;

  // @Column({ type: 'date' })
  // ngay_ct0: Date;

  @Column()
  so_ct0: string;

  @Column()
  so_seri0: string;

  @Column()
  ma_kh: string;

  @Column()
  ten_kh: string;

  @Column()
  dia_chi: string;

  @Column()
  ma_so_thue: string;

  @Column()
  ma_nt: string;

  @Column()
  ty_gia: number;

  @Column()
  ten_vt: string;

  @Column('float', { nullable: true })
  t_tien_nt: number;

  @Column('float', { nullable: true })
  t_tien: number;

  @Column('float', { nullable: true })
  thue_suat: number;

  @Column('float', { nullable: true })
  t_thue_nt: number;

  @Column('float', { nullable: true })
  t_thue: number;

  @Column()
  tk_thue_no: string;

  @Column({ nullable: true })
  ghi_chu: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ nullable: true })
  time: string;

  @Column({ type: 'date', nullable: true })
  date0: Date;

  @Column({ nullable: true })
  time0: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  ma_thue: string;

  @Column({ nullable: true })
  kh_mau_hd: string;

  @Column('float', { nullable: true })
  ty_giaf: number;

  @Column({ nullable: true })
  ma_ms: string;
}
