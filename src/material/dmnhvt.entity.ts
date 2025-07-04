import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmnhvt')
export class Dmnhvt {
    @PrimaryColumn('decimal', { precision: 1, scale: 0 })
    loai_nh: number;

    @PrimaryColumn('char', { length: 16 })
    ma_nh: string;

    @Column('nvarchar', { length: 128, nullable: true })
    ten_nh: string;

    @Column('nvarchar', { length: 128, nullable: true })
    ten_nh2: string;

    @Column('smalldatetime', { nullable: true })
    date0: Date;

    @Column('char', { length: 8, nullable: true })
    time0: string;

    @Column('numeric', { precision: 3, scale: 0, nullable: true })
    user_id0: number;

    @Column('varchar', { length: 16, nullable: true })
    user_name0: string;

    @Column('smalldatetime', { nullable: true })
    date: Date;

    @Column('char', { length: 8, nullable: true })
    time: string;

    @Column('numeric', { precision: 3, scale: 0, nullable: true })
    user_id: number;

    @Column('varchar', { length: 16, nullable: true })
    user_name: string;

    @Column('char', { length: 1, nullable: true })
    status: string;

    @Column('char', { length: 16, nullable: true })
    ma_td1: string;

    @Column('char', { length: 16, nullable: true })
    ma_td2: string;

    @Column('char', { length: 16, nullable: true })
    ma_td3: string;

    @Column('char', { length: 8, nullable: true })
    ngay_td1: string;

    @Column('char', { length: 8, nullable: true })
    ngay_td2: string;

    @Column('char', { length: 8, nullable: true })
    ngay_td3: string;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    sl_td1: number;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    sl_td2: number;

    @Column('decimal', { precision: 18, scale: 2, nullable: true })
    sl_td3: number;

    @Column('nvarchar', { length: 4000, nullable: true })
    gc_td1: string;

    @Column('nvarchar', { length: 4000, nullable: true })
    gc_td2: string;

    @Column('nvarchar', { length: 4000, nullable: true })
    gc_td3: string;

    @Column('nvarchar', { length: 4000, nullable: true })
    ma_tra_cuu: string;

    @Column('varchar', { length: 3, nullable: true })
    search: string;
}
