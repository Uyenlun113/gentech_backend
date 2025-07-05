import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmnhkh')
export class CustomerGroup {
    @PrimaryColumn('decimal', { precision: 1, scale: 0 })
    loai_nh: number;

    @PrimaryColumn('char', { length: 16 })
    ma_nh: string;

    @Column('nvarchar', { length: 128, nullable: true })
    ten_nh: string;

}