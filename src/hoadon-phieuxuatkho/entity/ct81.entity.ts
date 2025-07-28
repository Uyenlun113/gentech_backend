import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ct81')
export class Ct81 {
  @Column()
  stt_rec: string;

  @PrimaryColumn()
  stt_rec0: string;

  @Column()
  ma_vt: string;

  @Column()
  ma_kho_i: string;

  @Column()
  so_luong: number;

  @Column('float', { nullable: true })
  gia2: number;

  @Column('float', { nullable: true })
  tien2: number;

  @Column('float', { nullable: true })
  gia: number;

  @Column('float', { nullable: true })
  tien: number;

  @Column()
  tk_dt: string;

  @Column()
  tk_vt: string;

  @Column()
  tk_gv: string;
}
