import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('ct21')
export class Ct21Entity {
    @PrimaryColumn('varchar', { length: 11 })
    stt_rec: string;

    @PrimaryColumn('char', { length: 16 })
    ma_ct: string;

    @PrimaryColumn('char', { length: 16 })
    so_ct: string;

    @PrimaryColumn('char', { length: 16 })
    ma_kho_i: string;

    @Column('char', { length: 16, nullable: true })
    ma_vt: string;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

    @Column({ type: 'smalldatetime' })
    han_gh_i: Date;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    thue: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien_nt2: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien2: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    gia_nt2: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    gia_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tl_ck: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    ck_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    thue_suati: number;

    @Column('varchar', { length: 16, nullable: true })
    tk_dt: string;

    @Column('varchar', { length: 16, nullable: true })
    ma_thue_i: string;

    @Column('varchar', { length: 16, nullable: true })
    tk_thue_i: string;

    @Column('varchar', { length: 258, nullable: true })
    dien_giaii: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    so_luong: number;

}