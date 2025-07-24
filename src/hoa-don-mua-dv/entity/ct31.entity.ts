import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ct31')
export class Ct31{
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

  @Column()
  tk_vt: string;

  @Column({ nullable: true })
  dien_giaii: string;

  @Column('float', { nullable: true })
  tien_nt: number;

  @Column('float', { nullable: true })
  tien: number;
}
