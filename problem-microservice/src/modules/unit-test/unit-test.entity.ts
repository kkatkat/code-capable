import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    problem: Problem

    // TODO complete this relation with single ID (see duo)
}