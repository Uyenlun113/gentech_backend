import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ph85')
export class Ph85Entity {
    @PrimaryColumn({ type: 'char', length: 11 })
    stt_rec: string;

    @Column({ type: 'nvarchar', nullable: true })
    ong_ba: string;

    @Column({ type: 'nvarchar', nullable: true })
    hd_lenhdd: string;

    @Column({ type: 'nvarchar', nullable: true })
    dien_giai: string;

    @Column({ type: 'varchar', nullable: true })
    ma_kho: string;

    @Column({ type: 'varchar', nullable: true })
    ma_khon: string;

    @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
    t_so_luong: number;

    @Column({ type: 'numeric', precision: 13, scale: 3, nullable: true })
    t_tien_nt: number;

    @Column({ type: 'numeric', precision: 19, scale: 12, nullable: true })
    ty_gia: number;

    @Column({ type: 'char', nullable: true })
    ma_ct: string;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_lct: Date;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_ct: Date;

    @Column({ name: 'status', type: 'char', length: 8 })
    status: string;

    @Column({ type: 'char', length: 8, nullable: true })
    ma_qs: string;

    @Column({ type: 'char', length: 11, nullable: true })
    so_ct: string;
}
