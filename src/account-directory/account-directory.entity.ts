import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmtk')
export class AccountDirectory {
    @PrimaryColumn({ name: 'tk', type: 'varchar', length: 16 })
    tk: string;

    @Column({ name: 'ten_tk', type: 'nvarchar', length: 255 })
    ten_tk: string;

    @Column({ name: 'tk_me', type: 'varchar', length: 255, nullable: true })
    tk_me: string;

    @Column({ name: 'ma_nt', type: 'varchar', length: 255, nullable: true })
    ma_nt: string;

    @Column({ name: 'loai_tk', type: 'varchar', length: 255, nullable: true })
    loai_tk: string;
}