import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dmvt')
export class Material {
    @PrimaryColumn({ name: 'ma_vt', type: 'varchar', length: 16 })
    ma_vt: string;

    @Column({ name: 'part_no', type: 'varchar', length: 16, nullable: true })
    part_no: string;

    @Column({ name: 'ten_vt', type: 'nvarchar', length: 254, nullable: true })
    ten_vt: string;

    @Column({ name: 'ten_vt2', type: 'nvarchar', length: 254, nullable: true })
    ten_vt2: string;

    @Column({ name: 'dvt', type: 'nvarchar', length: 16, nullable: true })
    dvt: string;

    @Column({ name: 'dvt1', type: 'nvarchar', length: 16, nullable: true })
    dvt1: string;

    @Column({ name: 'he_so1', type: 'numeric', precision: 8, scale: 3, nullable: true })
    he_so1: number;

    @Column({ name: 'vt_ton_kho', type: 'numeric', precision: 1, scale: 0, nullable: true })
    vt_ton_kho: number;

    @Column({ name: 'gia_von', type: 'numeric', precision: 1, scale: 0, nullable: true })
    gia_von: number;

    @Column({ name: 'tk_vt', type: 'varchar', length: 16, nullable: true })
    tk_vt: string;

    @Column({ name: 'tk_gv', type: 'varchar', length: 16, nullable: true })
    tk_gv: string;

    @Column({ name: 'tk_dt', type: 'varchar', length: 16, nullable: true })
    tk_dt: string;

    @Column({ name: 'tk_tl', type: 'varchar', length: 16, nullable: true })
    tk_tl: string;

    @Column({ name: 'tk_spdd', type: 'varchar', length: 16, nullable: true })
    tk_spdd: string;

    @Column({ name: 'nh_vt1', type: 'varchar', length: 16, nullable: true })
    nh_vt1: string;

    @Column({ name: 'nh_vt2', type: 'varchar', length: 16, nullable: true })
    nh_vt2: string;

    @Column({ name: 'nh_vt3', type: 'varchar', length: 16, nullable: true })
    nh_vt3: string;

    @Column({ name: 'sl_min', type: 'numeric', precision: 13, scale: 3, nullable: true })
    sl_min: number;

    @Column({ name: 'sl_max', type: 'numeric', precision: 13, scale: 3, nullable: true })
    sl_max: number;

    @Column({ name: 'date', type: 'smalldatetime', nullable: true })
    date: Date;

    @Column({ name: 'time', type: 'varchar', length: 8, nullable: true })
    time: string;

    @Column({ name: 'user_id', type: 'numeric', precision: 3, scale: 0, nullable: true })
    user_id: number;

    @Column({ name: 'date0', type: 'smalldatetime', nullable: true })
    date0: Date;

    @Column({ name: 'time0', type: 'varchar', length: 8, nullable: true })
    time0: string;

    @Column({ name: 'user_id0', type: 'numeric', precision: 3, scale: 0, nullable: true })
    user_id0: number;

    @Column({ name: 'user_name0', type: 'varchar', length: 50, nullable: true })
    user_name0: string;

    @Column({ name: 'status', type: 'varchar', length: 1, nullable: true, default: 'A' })
    status: string;

    @Column({ name: 'sua_tk_vt', type: 'numeric', precision: 1, scale: 0, nullable: true })
    sua_tk_vt: number;

    @Column({ name: 'tk_cl_vt', type: 'varchar', length: 16, nullable: true })
    tk_cl_vt: string;

    @Column({ name: 'tk_dtnb', type: 'varchar', length: 16, nullable: true })
    tk_dtnb: string;

    @Column({ name: 'ghi_chu', type: 'nvarchar', length: 4000, nullable: true })
    ghi_chu: string;

    @Column({ name: 'ma_td1', type: 'varchar', length: 16, nullable: true })
    ma_td1: string;

    @Column({ name: 'ma_td2', type: 'varchar', length: 16, nullable: true })
    ma_td2: string;

    @Column({ name: 'ma_td3', type: 'varchar', length: 16, nullable: true })
    ma_td3: string;

    @Column({ name: 'ngay_td3', type: 'smalldatetime', nullable: true })
    ngay_td3: Date;

    @Column({ name: 'sl_td1', type: 'numeric', precision: 16, scale: 4, nullable: true })
    sl_td1: number;

    @Column({ name: 'sl_td2', type: 'numeric', precision: 16, scale: 4, nullable: true })
    sl_td2: number;

    @Column({ name: 'sl_td3', type: 'numeric', precision: 16, scale: 4, nullable: true })
    sl_td3: number;

    @Column({ name: 'gc_td1', type: 'nvarchar', length: 24, nullable: true })
    gc_td1: string;

    @Column({ name: 'gc_td2', type: 'nvarchar', length: 24, nullable: true })
    gc_td2: string;

    @Column({ name: 'gc_td3', type: 'nvarchar', length: 24, nullable: true })
    gc_td3: string;

    @Column({ name: 'ma_khond', type: 'varchar', length: 16, nullable: true })
    ma_khond: string;

    @Column({ name: 'ma_khon2', type: 'varchar', length: 16, nullable: true })
    ma_khon2: string;

    @Column({ name: 'thuend', type: 'numeric', precision: 7, scale: 3, nullable: true })
    thuend: number;

    @Column({ name: 'thue_nknd', type: 'numeric', precision: 7, scale: 3, nullable: true })
    thue_nknd: number;

    @Column({ name: 'loai_vt', type: 'varchar', length: 2, nullable: true })
    loai_vt: string;

    @Column({ name: 'ma_tra_cuu', type: 'nvarchar', length: 24, nullable: true })
    ma_tra_cuu: string;

    @Column({ name: 'tk_nvl', type: 'varchar', length: 16, nullable: true })
    tk_nvl: string;

    @Column({ name: 'tk_ck', type: 'varchar', length: 16, nullable: true })
    tk_ck: string;

    @Column({ name: 'tk_km', type: 'varchar', length: 16, nullable: true })
    tk_km: string;

    @Column({ name: 'search', type: 'varchar', length: 900, nullable: true })
    search: string;
}