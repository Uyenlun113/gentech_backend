import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ph11')
export class Ph11Entity {
    @PrimaryColumn({ name: 'ma_ct', type: 'varchar', length: 255 })
    ma_ct: string;

    @Column({ name: 'ma_dvcs', type: 'varchar', length: 255 })
    ma_dvcs: string;

    @Column({ name: 'ngay_lct', type: 'smalldatetime', nullable: true })
    ngay_lct: Date;

    @Column({ name: 'ps_no', type: 'numeric', precision: 18, scale: 2, nullable: true })
    ps_no: number;

    @Column({ name: 'ps_co', type: 'numeric', precision: 18, scale: 2, nullable: true })
    ps_co: number;

    @Column({ name: 'nh_dk', type: 'varchar', length: 255, nullable: true })
    nh_dk: string;

    @Column({ name: 'dien_giai', type: 'varchar', length: 255, nullable: true })
    dien_giai: string;


}