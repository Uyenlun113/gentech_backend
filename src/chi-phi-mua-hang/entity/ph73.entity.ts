import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Ct73Entity } from "./ct73.entity";
import { Ct73GtEntity } from "./ct73gt.entity";


@Entity('ph73')
export class Ph73Entity {
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
    t_tien_nt: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_cp_nt: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_thue: number

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    t_tt_nt: number

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

    @Column('varchar', { length: 16, nullable: true })
    loai_pb: string;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

    @Column({ name: 'ngay_lct', type: 'smalldatetime' })
    ngay_lct: Date;

    @Column({ type: 'smalldatetime' })
    ngay_pn: Date;

    @Column({ type: 'varchar', length: 16, nullable: true })
    so_pn: string

    @Column({ type: 'varchar', length: 16, nullable: true })
    ty_gia: string

    @OneToMany(() => Ct73Entity, (ct73) => ct73.ph73)
    ct73: Ct73Entity[];

    @OneToMany(() => Ct73GtEntity, (ct73gt) => ct73gt.ph73)
    ct73gt: Ct73GtEntity[];

}