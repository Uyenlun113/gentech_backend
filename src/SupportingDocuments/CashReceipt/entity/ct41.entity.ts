import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ct41') // tên bảng trong database
export class Ct41 {
  @PrimaryColumn()
  stt_rec: string;

  @Column()
  stt_rec0: string;

  @Column()
  ma_ct: string;

  @Column({ type: 'date' })
  ngay_ct: Date;

  @Column()
  so_ct: string;

  @Column()
  so_ct0: string;

  @Column({ name: 'dien_giaii', nullable: true })
  dien_giaii: string;

  @Column()
  tk_i: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  tien_nt: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  tien: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  thue: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  thue_nt: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  tien_tt: number;

  @Column({ type: 'decimal', precision: 18, scale: 10, nullable: true })
  ty_giahtf2: number;
}
