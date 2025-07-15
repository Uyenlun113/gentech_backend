import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct11')
export class Ct11Entity {
    @PrimaryColumn({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @PrimaryColumn({ name: 'stt_rec0', type: 'char', length: 11 })
    stt_rec0: string;

    @Column({ name: 'tk_i', type: 'char', length: 16 })
    tk_i: string;

    @Column({ name: 'ps_no', type: 'numeric', precision: 18, scale: 2, nullable: true })
    ps_no: number;

    @Column({ name: 'ps_co', type: 'numeric', precision: 18, scale: 2, nullable: true })
    ps_co: number;

    @Column({ name: 'nh_dk', type: 'char', length: 3, nullable: true })
    nh_dk: string;

    @Column({ name: 'dien_giaii', type: 'nvarchar', length: 508, nullable: true })
    dien_giaii: string;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

    @Column({ name: 'ma_kh_i', type: 'char', length: 8, nullable: true })
    ma_kh_i: string;
}
