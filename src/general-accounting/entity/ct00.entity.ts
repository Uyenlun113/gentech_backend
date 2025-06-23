import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct00')
export class Ct00Entity {
    @PrimaryColumn({ name: 'id', type: 'numeric', precision: 18, scale: 0 })
    id: number;

    @Column({ name: 'ma_dvcs', type: 'varchar', length: 255 })
    ma_dvcs: string;

    @Column({ name: 'ma_ct', type: 'varchar', length: 255 })
    ma_ct: string;

    @Column({ name: 'ma_gd', type: 'varchar', length: 255, nullable: true })
    ma_gd: string;

    @Column({ name: 'ma_kh', type: 'varchar', length: 255, nullable: true })
    ma_kh: string;

    @Column({ name: 'ngay_ct', type: 'smalldatetime', nullable: true })
    ngay_ct: Date;


}