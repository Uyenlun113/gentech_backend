import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ct00')
export class Ct00Entity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ name: 'stt_rec', type: 'char', length: 11 })
    stt_rec: string;

    @Column({ name: 'stt_rec0', type: 'char', length: 11 })
    stt_rec0: string;

    @Column({ name: 'ma_dvcs', type: 'char', length: 8 })
    ma_dvcs: string;

    @Column({ name: 'ma_ct', type: 'char', length: 3 })
    ma_ct: string;

    @Column({ name: 'ma_gd', type: 'char', length: 1, nullable: true })
    ma_gd: string;

    @Column({ name: 'ma_kh', type: 'char', length: 16, nullable: true })
    ma_kh: string | null;

    @Column({ name: 'ngay_ct', type: 'smalldatetime' })
    ngay_ct: Date;


}