import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('ct71gt')
export class Ct71GtEntity {
    @PrimaryColumn('varchar', { length: 11 })
    stt_rec: string;

    @PrimaryColumn('char', { length: 16 })
    ma_ct: string;

    @PrimaryColumn('char', { length: 16 })
    so_ct: string;

    @Column('char', { length: 16, nullable: true })
    ma_gd: string;

    @Column('char', { length: 16, nullable: true })
    ma_hd: string;

    @Column('char', { length: 16, nullable: true })
    ma_kho: string;

    @Column('varchar', { length: 128, nullable: true })
    ten_vt: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    so_luong: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    gia: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_thue: number;

    @Column('char', { length: 16, nullable: true })
    so_ct0: string;

    @Column('char', { length: 16, nullable: true })
    so_seri0: string;

    @Column('char', { length: 16, nullable: true })
    ma_kh: string;

    @Column('varchar', { length: 128, nullable: true })
    ten_kh: string;

    @Column('char', { length: 16, nullable: true })
    ma_dvcs: string;

    @Column('smalldatetime', { nullable: true })
    ngay_ct0: Date;

    @Column('varchar', { length: 256, nullable: true })
    dia_chi: string;

    @Column('varchar', { length: 128, nullable: true })
    ma_so_thue: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_tien: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    thue_suat: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    han_tt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_tt: number;

    @Column('varchar', { length: 16, nullable: true })
    tk_thue_no: string;

}