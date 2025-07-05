import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmkho')
export class Dmkho {
    @PrimaryColumn('char', { length: 16 })
    ma_kho: string;

    @Column({ name: 'ten_kho', type: 'nvarchar', length: 128, nullable: true })
    ten_kho: string;

    @Column({ name: 'ma_dvcs', type: 'nvarchar', length: 128, nullable: true })
    ma_dvcs: string;

    @Column({ name: 'tk_dl', type: 'nvarchar', length: 128, nullable: true })
    tk_dl: string;

    @Column('char', { length: 1, nullable: true })
    status: string;
}