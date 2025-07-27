import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity('ph21')
export class Ph21Entity {
    @PrimaryColumn('varchar', { length: 11 })
    stt_rec: string

    @PrimaryColumn('char', { length: 16 })
    ma_ct: string

    @PrimaryColumn('char', { length: 16 })
    ma_kh: string

    @Column('varchar', { length: 128, nullable: true })
    dia_chi: string

    @Column('varchar', { length: 128, nullable: true })
    ma_so_thue: string

    @Column('nvarchar', { length: 256, nullable: true })
    dien_giai: string

    @Column('varchar', { length: 16, nullable: true })
    ma_qs: string

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_so_luong: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_tien_nt2: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_thue: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_tt_nt: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien_hg_nt: number

    @Column('varchar', { length: 16, nullable: true })
    tk_thue_no: string

    @Column('char', { length: 1, nullable: true })
    status: string

    @Column('varchar', { length: 16, nullable: true })
    ma_dvcs: string

    @Column('varchar', { length: 16, nullable: true })
    so_ct: string

    @Column('varchar', { length: 128, nullable: true })
    ong_ba: string

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

    @Column({ name: 'ngay_lct', type: 'smalldatetime' })
    ngay_lct: Date;

    @Column({ type: 'varchar', length: 16, nullable: true })
    ty_gia: string

    @Column({ type: 'varchar', length: 16, nullable: true })
    ma_hd_me: string

    @Column({ type: 'varchar', length: 16, nullable: true })
    ma_nx: string

    @Column({ type: 'varchar', length: 256, nullable: true })
    ten_kh: string

    @Column({ type: 'varchar', length: 256, nullable: true })
    so_seri: string


}