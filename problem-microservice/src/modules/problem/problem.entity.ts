import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    starterCode: string;

    @Column()
    approved: boolean;
}