import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ct74')
export class Ct74 {
  @Column()
  stt_rec: string;

  @PrimaryColumn()
  stt_rec0: string;

  @Column()
  ma_ct: string;

  @Column({ type: 'datetime' })
  ngay_ct: Date;

  @Column()
  so_ct: string;

  @Column()
  ma_kho_i: string;

  @Column()
  ma_vt: string;

  @Column()
  tk_vt: number;

  @Column()
  ma_nx_i: number;

  @Column({ type: 'float' })
  so_luong: number;

  @Column({ type: 'float' })
  gia_nt: number;

  @Column({ type: 'float' })
  gia: number;

  @Column({ type: 'float' })
  tien_nt: number;

  @Column({ type: 'float' })
  tien: number;

  @Column({ nullable: true })
  sua_tk_vt: string;
}