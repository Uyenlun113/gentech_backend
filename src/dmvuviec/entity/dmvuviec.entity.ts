import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmvv')
export class Dmvuviec {
    @PrimaryColumn('char', { length: 16 })
    ma_vv: string;

    @Column({ name: 'ten_vv', type: 'nvarchar', length: 128, nullable: true })
    ten_vv: string;

    @Column({ name: 'ma_kh', type: 'nvarchar', length: 16, nullable: true })
    ma_kh: string;

    @Column({ name: 'ma_bpkd', type: 'nvarchar', length: 16, nullable: true })
    ma_bpkd: string;

    @Column({ name: 'ma_bpth', type: 'nvarchar', length: 16, nullable: true })
    ma_bpth: string;

    @Column({ name: 'tien_nt0', type: 'decimal', precision: 18, scale: 2, nullable: true })
    tien_nt0: number;

    @Column({ name: 'thue_nt', type: 'decimal', precision: 18, scale: 2, nullable: true })
    thue_nt: number;
}
