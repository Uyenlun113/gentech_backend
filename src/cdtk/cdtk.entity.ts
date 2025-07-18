import { AccountDirectory } from 'src/account-directory/entity/account-directory.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('cdtk')
export class CdtkEntity {
    @PrimaryColumn('char', { length: 8 })
    ma_dvcs: string;

    @PrimaryColumn('numeric', { precision: 4, scale: 0 })
    nam: number;

    @PrimaryColumn('char', { length: 16 })
    tk: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_no00: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_co00: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_no_nt00: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_co_nt00: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_no1: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_co1: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_no_nt1: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_co_nt1: number;

    @Column('smalldatetime', { nullable: true })
    date: Date;

    @Column('char', { length: 1, nullable: true })
    status: string;

    @ManyToOne(() => AccountDirectory, { eager: false })
    @JoinColumn({ name: 'tk', referencedColumnName: 'tk' })
    account: AccountDirectory;
}
