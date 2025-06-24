import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ph11')
export class Ph11Entity {
    @PrimaryColumn({ name: 'ma_ct', type: 'char', length: 3 })
    ma_ct: string;

    @PrimaryColumn({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @Column({ name: 'ngay_lct', type: 'smalldatetime', nullable: true })
    ngay_lct: Date;

    @Column({ name: 'dien_giai', type: 'nvarchar', length: 255, nullable: true })
    dien_giai: string;

    @Column({ name: 'ty_giaf', type: 'numeric', precision: 19, scale: 12, nullable: true })
    ty_giaf: number;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;
}
