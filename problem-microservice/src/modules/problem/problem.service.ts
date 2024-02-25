import { InjectRepository } from "@nestjs/typeorm";
import { Problem, difficulties } from "./problem.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProblemInputDTO } from "./problemInput.dto";
import { ProblemUpdateDTO } from "./problemUpdate.dto";


@Injectable()
export class ProblemService {
    constructor(
        @InjectRepository(Problem)
        protected readonly problemRepo: Repository<Problem>
    ) {}

    async findOne(options: FindOneOptions<Problem>): Promise<Problem> {
        return this.problemRepo.findOne(options);
    }

    async find(options?: FindManyOptions<Problem>): Promise<Problem[]> {
        return this.problemRepo.find(options);
    }

    async count(options?: FindManyOptions<Problem>) {
        return this.problemRepo.count(options);
    }

    async create(problemData: Partial<Problem> & ProblemInputDTO): Promise<Problem> {
        const problem: Problem = this.problemRepo.create({
            ...problemData
        });

        // TODO checks for relations (see duo)

        return this.problemRepo.save(problem);
    }

    async update(problemData: Partial<Problem> & ProblemUpdateDTO): Promise<Problem> {
        if (!(await this.findOne({where: {id:problemData.id}}))) {
            throw new NotFoundException();
        }

        if (problemData.difficulty) {
            if (!difficulties.includes(problemData.difficulty)) {
                throw new BadRequestException('Invalid difficulty');
            }
        }

        const problem: Partial<Problem> = problemData;

        // TODO checks for relations (see duo)

        return this.problemRepo.save(problem);
    }

    async delete(options: FindOptionsWhere<Problem>) {
        return this.problemRepo.delete(options);
    }
    
}