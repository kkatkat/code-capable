import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Problem } from "../problem/problem.entity";



@Entity()
export class Solution {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({
        type: 'text'
    })
    code: string;

    @ManyToOne(() => Problem, (problem) => problem.solutions, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'problemId'
    })
    problem: Problem;

    @Column({
        nullable: false,
        name: 'problemId'
    })
    problemId: number;

    @CreateDateColumn()
    createdAt: Date;
}