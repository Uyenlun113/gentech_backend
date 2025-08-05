import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct46')
export class Ct46Entity {
    @PrimaryColumn({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @PrimaryColumn({ name: 'ma_ct', type: 'char', length: 3 })
    ma_ct: string;

    @PrimaryColumn({ name: 'so_ct', type: 'char', length: 12 })
    so_ct: string;

    @Column({ type: 'date' })
    ngay_ct: Date;

    @Column({ type: 'varchar' })
    loai_hd: string;

    @PrimaryColumn({ name: 'so_ct0', type: 'char', length: 12 })
    so_ct0: string;

    @Column({ name: 'tk_i', type: 'char', length: 16 })
    tk_i: string;

    @Column({ name: 'dien_giaii', type: 'nvarchar', length: 254, nullable: true })
    dien_giaii: string;

    @Column({ name: 'tien', type: 'numeric', precision: 16, scale: 2, nullable: true })
    tien: number;

    @Column({ name: 'tien_nt', type: 'numeric', precision: 16, scale: 2, nullable: true })
    tien_nt: number;

    @Column({ name: 'thue_suat', type: 'numeric', precision: 6, scale: 2, nullable: true })
    thue_suat: number;

    @Column({ name: 'thue', type: 'numeric', precision: 16, scale: 2, nullable: true })
    thue: number;

    @Column({ name: 'tt', type: 'numeric', precision: 16, scale: 2, nullable: true })
    tt: number;


    @Column({ name: 'ma_ms', type: 'char', length: 8, nullable: true })
    ma_ms: string;

    @Column({ name: 'kh_mau_hd', type: 'varchar', length: 64, nullable: true })
    kh_mau_hd: string;

    @Column({ name: 'ma_kh_t', type: 'char', length: 16, nullable: true })
    ma_kh_t: string;

    @Column({ name: 'so_seri0', type: 'char', length: 16, nullable: true })
    so_seri0: string;

    @Column({ name: 'ten_kh_t', type: 'nvarchar', length: 128, nullable: true })
    ten_kh_t: string;

    @Column({ name: 'dia_chi_t', type: 'nvarchar', length: 128, nullable: true })
    dia_chi_t: string;

    @Column({ name: 'mst_t', type: 'nvarchar', length: 128, nullable: true })
    mst_t: string;

    @Column({ name: 'ten_vt_t', type: 'nvarchar', length: 128, nullable: true })
    ten_vt_t: string;

    @Column({ name: 'ghi_chu_t', type: 'nvarchar', length: 128, nullable: true })
    ghi_chu_t: string;

}
