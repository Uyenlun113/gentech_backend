import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct11gt')
export class Ct11GtEntity {

    @PrimaryColumn({ name: 'so_seri0', type: 'varchar', length: 255 })
    so_seri0: string;

    @Column({ name: 'ma_kh', type: 'varchar', length: 255 })
    ma_kh: string;

    @Column({ name: 'ten_kh', type: 'varchar', length: 255, nullable: true })
    ten_kh: string;

    @Column({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

}