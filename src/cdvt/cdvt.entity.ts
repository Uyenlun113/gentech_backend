import { Material } from 'src/material/material.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('cdvt')
export class CdvtEntity {
    @PrimaryColumn('numeric', { precision: 4, scale: 0 })
    nam: number;

    @PrimaryColumn('char', { length: 16 })
    ma_kho: string;

    @PrimaryColumn('char', { length: 16 })
    ma_vt: string;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    ton00: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du00: number;

    @Column('numeric', { precision: 16, scale: 2, nullable: true })
    du_nt00: number;

    @ManyToOne(() => Material, { eager: false })
    @JoinColumn({ name: 'ma_vt', referencedColumnName: 'ma_vt' })
    vatTu: Material;
}
