import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmtk')
export class AccountDirectory {
    @PrimaryColumn({ name: 'tk', type: 'varchar', length: 16 })
    tk: string;

    @Column({ name: 'tk0', type: 'char', length: 16 })
    tk0: string;

    @Column({ name: 'ten_tk', type: 'nvarchar', length: 255 })
    ten_tk: string;

    @Column({ name: 'tk_me', type: 'varchar', length: 255, nullable: true })
    tk_me: string;

    @Column({ name: 'ma_nt', type: 'varchar', length: 255, nullable: true })
    ma_nt: string;

    @Column({ name: 'nh_tk0', type: 'varchar', length: 255, nullable: true })
    nh_tk: string;

    @Column({ name: 'tk_sc', type: 'numeric', precision: 1, scale: 0, nullable: true })
    tk_sc: number;

    @Column({ name: 'tk_cn', type: 'numeric', precision: 1, scale: 0, nullable: true })
    tk_cn: number;
}