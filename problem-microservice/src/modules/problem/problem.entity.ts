import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export const difficulties = ['easy', 'medium', 'hard'] as const;

export type Difficulty = typeof difficulties[number];

@Entity()
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "varchar",
        length: 2000
    })
    description: string;

    @Column({
        type: "varchar",
        length: 2000
    })
    starterCode: string;

    @Column({
        type: "varchar",
        length: 2000,
        nullable: true
    })
    constraints?: string;

    @Column({
        default: false
    })
    approved: boolean;

    @Column()
    difficulty: string;

    @Column()
    creatorId: number;

    @CreateDateColumn()
    createdAt: Date;
}