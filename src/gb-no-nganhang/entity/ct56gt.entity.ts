import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ct56gt')
export class Ct56gt {
  @PrimaryColumn()
  stt_rec: string;

  @PrimaryColumn()
  stt_rec0: string;

  @Column({ nullable: true })
  so_ct0?: string;

  @Column({ type: 'date', nullable: true })
  ngay_ct?: Date;

  @Column({ nullable: true })
  tk_thue_no?: string;

  @Column({ nullable: true })
  ma_ms?: string;

  @Column({ nullable: true })
  kh_mau_hd?: string;

  @Column({ nullable: true })
  ma_kh?: string;

  @Column({ nullable: true })
  so_seri0?: string;

  @Column({ nullable: true })
  ten_kh?: string;

  @Column({ nullable: true })
  dia_chi?: string;

  @Column({ nullable: true })
  ma_so_thue?: string;

  @Column({ nullable: true })
  ten_vt?: string;

  @Column({ nullable: true })
  ma_thue?: string;

  @Column({ nullable: true })
  ghi_chu?: string;

  @Column({ type: 'float', nullable: true })
  thue_suat?: number;

  @Column({ type: 'float', nullable: true })
  t_thue?: number;

  @Column({ type: 'float', nullable: true })
  t_tien?: number;

  @Column({ type: 'float', nullable: true })
  t_tt?: number;

  // 🔧 Thiếu trường này gây lỗi `tk_du` not found
  @Column({ nullable: true })
  tk_du?: string;
}
