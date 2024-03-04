import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UnitTest } from "../unit-test/unit-test.entity";
import { Solution } from "../solution/solution.entity";

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

    @OneToMany(() => UnitTest, (unitTest) => unitTest.problem)
    unitTests: UnitTest[];

    @OneToMany(() => Solution, (solution) => solution.problem)
    solutions: Solution[];
}