import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct11gt')
export class Ct11GtEntity {
    @PrimaryColumn({ name: 'so_seri0', type: 'nvarchar', length: 24 })
    so_seri0: string;

    @Column({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @Column({ name: 'so_ct0', type: 'nvarchar', length: 24, nullable: true })
    so_ct0: string;

    @Column({ name: 'ngay_ct0', type: 'datetime', nullable: true })
    ngay_ct0: Date;

    @Column({ name: 'ma_kh', type: 'char', length: 16 })
    ma_kh: string;

    @Column({ name: 'ten_kh', type: 'nvarchar', length: 256, nullable: true })
    ten_kh: string;

    @Column({ name: 'dia_chi', type: 'nvarchar', length: 128, nullable: true })
    dia_chi: string;

    @Column({ name: 'ma_so_thue', type: 'nvarchar', length: 18, nullable: true })
    ma_so_thue: string;

    @Column({ name: 'ty_gia', type: 'numeric', precision: 19, scale: 12, nullable: true })
    ty_gia: string;

    @Column({ name: 'ten_vt', type: 'nvarchar', length: 254, nullable: true })
    ten_vt: string;

    @Column({ name: 't_tien', type: 'numeric', precision: 16, scale: 2, nullable: true })
    t_tien: string;

    @Column({ name: 'thue_suat', type: 'numeric', precision: 6, scale: 2, nullable: true })
    thue_suat: string;

    @Column({ name: 't_thue', type: 'numeric', precision: 16, scale: 2, nullable: true })
    t_thue: string;

    @Column({ name: 't_tt', type: 'numeric', precision: 16, scale: 2, nullable: true })
    t_tt: string;

    @Column({ name: 'tk_thue_no', type: 'char', length: 16, nullable: true })
    tk_thue_no: string;

    @Column({ name: 'tk_du', type: 'char', length: 16, nullable: true })
    tk_du: string;

    @Column({ name: 'ma_thue', type: 'char', length: 16, nullable: true })
    ma_thue: string;

    @Column({ name: 'ma_ms', type: 'char', length: 16, nullable: true })
    ma_ms: string;

    @Column({ name: 'kh_mau_hd', type: 'varchar', length: 64, nullable: true })
    kh_mau_hd: string;
}