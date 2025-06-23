import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct11')
export class Ct11Entity {
    @PrimaryColumn({ name: 'stt_rec', type: 'varchar', length: 255 })
    stt_rec: string;

    @Column({ name: 'tk', type: 'varchar', length: 255 })
    tk: string;

    @Column({ name: 'ps_no', type: 'numeric', precision: 18, scale: 2, nullable: true })
    ps_no: number;

    @Column({ name: 'ps_co', type: 'numeric', precision: 18, scale: 2, nullable: true })
    ps_co: number;

    @Column({ name: 'nh_dk', type: 'varchar', length: 255, nullable: true })
    nh_dk: string;

    @Column({ name: 'dien_giai', type: 'varchar', length: 255, nullable: true })
    dien_giai: string;


}