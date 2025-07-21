import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct85')
export class Ct85Entity {
    @PrimaryColumn({ type: 'char', length: 11 })
    stt_rec: string;

    @Column({ type: 'char', nullable: true })
    ma_ct: string;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_ct: Date;

    @Column({ type: 'char', nullable: true })
    ma_vt: string;

    @Column({ type: 'char', nullable: true })
    tk_vt: string;

    @Column({ type: 'char', nullable: true })
    ma_nx_i: string;

    @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
    so_luong: string;
}
