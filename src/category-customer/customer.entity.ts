import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmkh')
export class Customer {
    @PrimaryColumn({ name: 'ma_kh', type: 'varchar', length: 50 })
    ma_kh: string;

    @Column({ name: 'ten_kh', type: 'nvarchar', length: 255 })
    ten_kh: string;

    @Column({ name: 'e_mail', type: 'varchar', length: 255, nullable: true })
    e_mail: string;

    @Column({ name: 'dien_thoai', type: 'varchar', length: 20, nullable: true })
    dien_thoai: string;

    @Column({ name: 'dia_chi', type: 'nvarchar', length: 500, nullable: true })
    dia_chi: string;

    @Column({ name: 'ma_so_thue', type: 'varchar', length: 50, nullable: true })
    ma_so_thue: string;

    @Column({ name: 'ma_tra_cuu', type: 'varchar', length: 50, nullable: true })
    ma_tra_cuu: string;

    @Column({ name: 'tk_nh', type: 'varchar', length: 50, nullable: true })
    tk_nh: string;

    @Column({ name: 'ten_nh', type: 'nvarchar', length: 255, nullable: true })
    ten_nh: string;

    @Column({ name: 'ghi_chu', type: 'nvarchar', length: 1000, nullable: true })
    ghi_chu: string;

    @Column({ name: 'status', type: 'varchar', length: 20, default: '1' })
    status: string;

    @Column({ name: "nh_kh1", type: "varchar", length: 50, nullable: true })
    nh_kh1: string

    @Column({ name: "nh_kh2", type: "varchar", length: 50, nullable: true })
    nh_kh2: string

    @Column({ name: "nh_kh3", type: "varchar", length: 50, nullable: true })
    nh_kh3: string

    @Column({ name: "doi_tac", type: "nvarchar", length: 32, nullable: true })
    doi_tac: string

}