import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('ph46')
export class Ph46Entity {
    @PrimaryColumn({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @Column({ name: 'ma_dvcs', type: 'char', length: 8 })
    ma_dvcs: string;

    @Column({ name: 'ma_ct', type: 'char', length: 3 })
    ma_ct: string;

    @Column({ name: 'ma_gd', type: 'char', length: 1 })
    ma_gd: string;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

    @Column({ name: 'ngay_lct', type: 'smalldatetime' })
    ngay_lct: Date;

    @Column({ name: 'so_ct', type: 'char', length: 12 })
    so_ct: string;

    @Column({ name: 'ma_kh', type: 'char', length: 16 })
    ma_kh: string;

    @Column({ name: 'dia_chi', type: 'nvarchar', length: 128, nullable: true })
    dia_chi: string;

    @Column({ name: 'ong_ba', type: 'nvarchar', length: 48, nullable: true })
    ong_ba: string;

    @Column({ name: 'dien_giai', type: 'nvarchar', length: 254, nullable: true })
    dien_giai: string;

    @Column({ name: 'tk', type: 'char', length: 16 })
    tk: string;

    @Column({ name: 'ma_nt', type: 'char', length: 3 })
    ma_nt: string;

    @Column({ name: 'ty_gia', type: 'numeric', precision: 18, scale: 6, nullable: true })
    ty_gia: number;

    @Column({ name: 't_tien_nt', type: 'numeric', precision: 18, scale: 2, nullable: true })
    t_tien_nt: number;

    @Column({ name: 't_tien', type: 'numeric', precision: 18, scale: 2, nullable: true })
    t_tien: number;

    @Column({ name: 't_thue_nt', type: 'numeric', precision: 18, scale: 2, nullable: true })
    t_thue_nt: number;

    @Column({ name: 't_thue', type: 'numeric', precision: 18, scale: 2, nullable: true })
    t_thue: number;

    @Column({ name: 't_tt_nt', type: 'numeric', precision: 18, scale: 2, nullable: true })
    t_tt_nt: number;

    @Column({ name: 't_tt', type: 'numeric', precision: 18, scale: 2, nullable: true })
    t_tt: number;

    @Column({ name: 'date', type: 'smalldatetime', nullable: true })
    date: Date;

    @Column({ name: 'time', type: 'char', length: 8, nullable: true })
    time: string;

    @Column({ name: 'user_id', type: 'char', length: 8, nullable: true })
    user_id: string;

    @Column({ name: 'date0', type: 'smalldatetime', nullable: true })
    date0: Date;

    @Column({ name: 'time0', type: 'char', length: 8, nullable: true })
    time0: string;

    @Column({ name: 'user_id0', type: 'char', length: 8, nullable: true })
    user_id0: string;

    @Column({ name: 'status', type: 'char', length: 8, nullable: true })
    status: string;

    @Column({ name: 'loai_ct', type: 'char', length: 3, nullable: true })
    loai_ct: string;

    @Column({ name: 'han_tt', type: 'char', length: 16, nullable: true })
    han_tt: string;

    @Column({ name: 'ma_qs', type: 'char', length: 16, nullable: true })
    ma_qs: string;

    @Column({ name: 'ty_giaf', type: 'numeric', precision: 18, scale: 6, nullable: true })
    ty_giaf: number;

    @Column({ name: 'hd_thue', type: 'char', length: 1, nullable: true })
    hd_thue: string;
}
