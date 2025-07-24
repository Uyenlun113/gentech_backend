import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Ph73Entity } from "./ph73.entity";


@Entity('ct73')
export class Ct73Entity {
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

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    gia: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    thue_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien_nt0: number;

    @Column('varchar', { length: 16, nullable: true })
    tk_vt: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    so_luong: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    cp_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    cp: number;


    @ManyToOne(() => Ph73Entity, ph73 => ph73.ct73gt, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'stt_rec', referencedColumnName: 'stt_rec' })
    ph73: Ph73Entity;
}