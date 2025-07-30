import { AccountDirectory } from "src/account-directory/entity/account-directory.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Ph21Entity } from "./ph21.entity";


@Entity('ct21')
export class Ct21Entity {
    @PrimaryColumn('varchar', { length: 11 })
    stt_rec: string;

    @PrimaryColumn('char', { length: 16 })
    ma_ct: string;

    @Column('char', { length: 16 })
    so_ct: string;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;

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
    tk_ck: string;

    @Column('varchar', { length: 16, nullable: true })
    ma_thue_i: string;

    @Column('varchar', { length: 16, nullable: true })
    tk_thue_i: string;

    @Column('varchar', { length: 258, nullable: true })
    dien_giaii: string;

    @Column('varchar', { length: 258, nullable: true })
    dvt: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    so_luong: number;

    @ManyToOne(() => Ph21Entity, ph21 => ph21.hangHoa, { onDelete: 'CASCADE' })
    @JoinColumn([
        { name: 'stt_rec', referencedColumnName: 'stt_rec' },
        { name: 'ma_ct', referencedColumnName: 'ma_ct' }
    ])
    ph21: Ph21Entity;

    @ManyToOne(() => AccountDirectory)
    @JoinColumn({ name: 'tk_dt', referencedColumnName: 'tk' })
    tkDtInfo: AccountDirectory;

}