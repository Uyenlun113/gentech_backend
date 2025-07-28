import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ct70')
export class Ct70 {
    @Column()
    stt_rec: string;

    @PrimaryColumn()
    stt_rec0: string;

    @Column()
    ma_ct: string;

    @Column()
    ma_gd: string;

    @Column({ type: 'date' })
    ngay_ct: Date;

    @Column({ type: 'date' })
    ngay_lct: Date;

    @Column()
    so_seri: string;

    @Column()
    ma_kh: string;

    @Column()
    ma_kho: string;

    @Column()
    dien_giai: string;

    @Column()
    ma_bp: string;

    @Column()
    ma_nt: string;

    @Column()
    ma_nx: string;

    @Column()
    ma_vt: string;

    @Column()
    tk_dt: string;

    @Column()
    tk_vt: string;

    @Column()
    tk_gv: string;

    @Column()
    ma_qs: string;
}
