import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmvt')
export class Material {
    @PrimaryColumn({ name: 'ma_vt', type: 'varchar', length: 16 })
    ma_vt: string;

    @Column({ name: 'ten_vt', type: 'nvarchar', length: 254, nullable: true })
    ten_vt: string;

    @Column({ name: 'dvt', type: 'nvarchar', length: 16, nullable: true })
    dvt: string;

    @Column({ name: 'vt_ton_kho', type: 'numeric', precision: 1, scale: 0, nullable: true })
    vt_ton_kho: number;

    @Column({ name: 'tk_vt', type: 'varchar', length: 16, nullable: true })
    tk_vt: string;

    @Column({ name: 'tk_gv', type: 'varchar', length: 16, nullable: true })
    tk_gv: string;

    @Column({ name: 'tk_dt', type: 'varchar', length: 16, nullable: true })
    tk_dt: string;

    @Column({ name: 'tk_spdd', type: 'varchar', length: 16, nullable: true })
    tk_spdd: string;

    @Column({ name: 'tk_tl', type: 'varchar', length: 16, nullable: true })
    tk_tl: string;

    @Column({ name: 'tk_dtnb', type: 'varchar', length: 16, nullable: true })
    tk_dtnb: string;

    @Column({ name: 'nh_vt1', type: 'varchar', length: 16, nullable: true })
    nh_vt1: string;

    @Column({ name: 'sl_min', type: 'numeric', precision: 13, scale: 3, nullable: true })
    sl_min: number;

    @Column({ name: 'sl_max', type: 'numeric', precision: 13, scale: 3, nullable: true })
    sl_max: number;

    @Column({ name: 'date', type: 'smalldatetime', nullable: true })
    date: Date;

    @Column({ name: 'sua_tk_vt', type: 'numeric', precision: 1, scale: 0, nullable: true })
    sua_tk_vt: number;

    @Column({ name: 'tk_cl_vt', type: 'varchar', length: 16, nullable: true })
    tk_cl_vt: string;

    @Column({ name: 'ghi_chu', type: 'nvarchar', length: 4000, nullable: true })
    ghi_chu: string;

    @Column({ name: 'tk_km', type: 'varchar', length: 16, nullable: true })
    tk_km: string;

    @Column({ name: 'tk_ck', type: 'varchar', length: 16, nullable: true })
    tk_ck: string;

    @Column({ name: 'tk_nvl', type: 'varchar', length: 16, nullable: true })
    tk_nvl: string;

    @Column({ name: 'loai_vt', type: 'varchar', length: 7, nullable: true })
    loai_vt: string;

    @Column({ name: 'time', type: 'varchar', length: 8, nullable: true })
    time: string;

    @Column({ name: 'status', type: 'varchar', length: 1, nullable: true, default: 'A' })
    status: string;
    

}