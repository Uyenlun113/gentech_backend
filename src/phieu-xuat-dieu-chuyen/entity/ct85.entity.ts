import { Material } from 'src/material/material.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('ct85')
export class Ct85Entity {
    @PrimaryColumn({ type: 'char', length: 8 })
    dvt2: string;

    @Column({ type: 'char' })
    ma_ct: string;

    @Column({ type: 'char', length: 11 })
    stt_rec: string;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_ct: Date;

    @Column({ type: 'char', nullable: true })
    ma_vt: string;

    @Column({ type: 'char', nullable: true })
    tk_vt: string;

    @Column({ type: 'char', nullable: true })
    ma_nx_i: string;

    @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
    so_luong: number;

    @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
    gia_nt: number;

    @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
    tien_nt: number;

    @ManyToOne(() => Material, { eager: false })
    @JoinColumn({ name: 'ma_vt', referencedColumnName: 'ma_vt' })
    vatTu: Material;
}
