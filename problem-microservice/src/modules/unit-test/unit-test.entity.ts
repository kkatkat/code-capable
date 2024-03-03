import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Problem } from "../problem/problem.entity";



@Entity()
export class UnitTest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 1000
    })
    code: string

    @Column({
        default: true,
    })
    visible: boolean

    @ManyToOne(() => Problem, (problem) => problem.unitTests, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({
        name: 'problemId'
    })
    problem: Problem

    @Column({
        nullable: false,
        name: 'problemId'
    })
    problemId: number
}