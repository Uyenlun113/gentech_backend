import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DmhdEntity } from "./dmhd.entity";

@Entity('dmhdct')
export class DmhdctEntity {
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
    thue_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien_nt2: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tien_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    gia_nt2: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    gia_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    tl_ck: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    ck_nt: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    thue_suat: number;

    @Column('varchar', { length: 16, nullable: true })
    tk_vt: string;

    @Column('varchar', { length: 16, nullable: true })
    ma_thue: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    so_luong: number;

    @ManyToOne(() => DmhdEntity, dmhd => dmhd.hangHoa, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'stt_rec', referencedColumnName: 'stt_rec' })
    dmhd: DmhdEntity;

}