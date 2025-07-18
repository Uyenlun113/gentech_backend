import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmstt')
export class DmsttEntity {
    @PrimaryColumn({ type: 'numeric', precision: 7, scale: 0 })
    stt_rec: number;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_dn: Date;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_ks: Date;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_ky1: Date;

    @Column({ type: 'smalldatetime', nullable: true })
    ngay_ks_ky: Date;
}
