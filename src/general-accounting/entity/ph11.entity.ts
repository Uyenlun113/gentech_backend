import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ph11')
export class Ph11Entity {
    @PrimaryColumn({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @Column({ name: 'so_ct', type: 'char', length: 3 })
    so_ct: string;

    @Column({ name: 'ma_qs', type: 'varchar', length: 11 })
    ma_qs: string;

    @Column({ name: 'ma_ct', type: 'varchar', length: 11, nullable: true })
    ma_ct: string;

    @Column({ name: 'ngay_lct', type: 'smalldatetime', nullable: true })
    ngay_lct: Date;

    @Column({ name: 'dien_giai', type: 'nvarchar', length: 255, nullable: true })
    dien_giai: string;

    @Column({ name: 'ty_giaf', type: 'numeric', precision: 19, scale: 12, nullable: true })
    ty_giaf: number;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

    @Column({ name: 'ma_dvcs', type: 'char', length: 8 })
    ma_dvcs: string;

    @Column({ name: 'status', type: 'char', length: 8 })
    status: string;
}
