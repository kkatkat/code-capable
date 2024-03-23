import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UnitTest } from "../unit-test/unit-test.entity";
import { Solution } from "../solution/solution.entity";

export const difficulties = ['easy', 'medium', 'hard'];

// export type Difficulty = typeof difficulties[number];

@Entity()
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'text'
    })
    description: string;

    @Column({
        type: 'text'
    })
    starterCode: string;

    @Column({
        type: 'text',
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

    @Column()
    creatorName: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => UnitTest, (unitTest) => unitTest.problem, {
        cascade: true
    })
    unitTests: UnitTest[];

    @OneToMany(() => Solution, (solution) => solution.problem)
    solutions: Solution[];
}