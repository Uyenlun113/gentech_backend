import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ct46gt')
export class Ct46gtEntity {
    @PrimaryColumn({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @PrimaryColumn({ name: 'ma_ct', type: 'char', length: 3 })
    ma_ct: string;

    @PrimaryColumn({ name: 'so_ct0', type: 'char', length: 12 })
    so_ct0: string;

    @Column({ name: 'tk_thue_no', type: 'char', length: 16 })
    tk_thue_no: string;

    @Column({ name: 'tien', type: 'numeric', precision: 16, scale: 2, nullable: true })
    tien: number;

    @Column({ name: 'thue_suat', type: 'numeric', precision: 6, scale: 2, nullable: true })
    thue_suat: number;

    @Column({ name: 'thue', type: 'numeric', precision: 16, scale: 2, nullable: true })
    thue: number;

    @Column({ name: 'tt', type: 'numeric', precision: 16, scale: 2, nullable: true })
    tt: number;

    @Column({ name: 'tk_thue_i', type: 'char', length: 16, nullable: true })
    tk_thue_i: string;

    @Column({ name: 'loai_hd', type: 'char', length: 8, nullable: true })
    loai_hd: string;

    @Column({ name: 'ma_ms', type: 'char', length: 8, nullable: true })
    ma_ms: string;

    @Column({ name: 'mau_bc', type: 'varchar', length: 64, nullable: true })
    mau_bc: string;

    @Column({ name: 'ma_kh', type: 'char', length: 16, nullable: true })
    ma_kh: string;

    @Column({ name: 'so_seri0', type: 'char', length: 16, nullable: true })
    so_seri0: string;

    @Column({ name: 'ten_kh', type: 'nvarchar', length: 128, nullable: true })
    ten_kh: string;

    @Column({ name: 'dia_chi', type: 'nvarchar', length: 128, nullable: true })
    dia_chi: string;

    @Column({ name: 'ma_so_thue', type: 'nvarchar', length: 128, nullable: true })
    ma_so_thue: string;

    @Column({ name: 'ten_vt', type: 'nvarchar', length: 128, nullable: true })
    ten_vt: string;

    @Column({ name: 'ma_thue', type: 'nvarchar', length: 128, nullable: true })
    ma_thue: string;

    @Column({ name: 'ghi_chu', type: 'nvarchar', length: 128, nullable: true })
    ghi_chu: string;

    @Column({ name: 't_thue', type: 'nvarchar', length: 128, nullable: true })
    t_thue: string;

    @Column({ name: 't_tien', type: 'nvarchar', length: 128, nullable: true })
    t_tien: string;

    @Column({ name: 't_tt', type: 'nvarchar', length: 128, nullable: true })
    t_tt: string;

}
