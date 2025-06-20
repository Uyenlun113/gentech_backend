import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('userinfo')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ length: 100 })
    user_name: string;

    @Column({ length: 255 })
    password: string;

}