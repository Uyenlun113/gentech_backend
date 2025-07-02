import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmnhtk')
export class AccountGroup {
    @PrimaryColumn({ name: 'ma_nh', type: 'char', length: 16 })
    ma_nh: string;

    @Column({ name: 'loai_nh', type: 'numeric', precision: 1, scale: 0 })
    loai_nh: number;

    @Column({ name: 'ten_nh', type: 'nvarchar', length: 256, nullable: true })
    ten_nh: string;
}