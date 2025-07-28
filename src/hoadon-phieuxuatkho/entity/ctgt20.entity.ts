import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ctgt20')
export class Ctgt20 {
    @Column()
    stt_rec: string;

    @PrimaryColumn()
    stt_rec0: string;

    @Column()
    ma_thue: string;

    @Column()
    thue_suat: number;

    @Column()
    ma_ct: string;

    @Column({ type: 'date' })
    ngay_ct: Date;

    @Column({ type: 'date' })
    ngay_lct: Date;

    @Column()
    so_seri: string;

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

    @Column('float', { nullable: true })
    ty_gia: number;

    @Column()
    ten_vt: string;

    @Column()
    ma_bp: string;

    @Column()
    ma_kho: string;

    @Column()
    ghi_chu: string;
    
    @Column()
    gc_thue: string;
}
