import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Solution } from "./solution.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ServiceFactory } from "../factory/service-factory.service";
import { SolutionInputDTO } from "./solution-input.dto";
import { Problem } from "../problem/problem.entity";

export type UserStatistics = {
    easies: number,
    mediums: number,
    hards: number,
    total: number,
}


@Injectable()
export class SolutionService {
    constructor(
        @InjectRepository(Solution)
        protected readonly solutionRepo: Repository<Solution>,

        @Inject(forwardRef(() => ServiceFactory))
        protected readonly sf: ServiceFactory,
    ) { }

    async findOne(options: FindOneOptions<Solution>): Promise<Solution> {
        return this.solutionRepo.findOne(options);
    }

    async find(options?: FindManyOptions<Solution>): Promise<Solution[]> {
        return this.solutionRepo.find(options);
    }

    async count(options?: FindManyOptions<Solution>) {
        return this.solutionRepo.count(options);
    }

    async create(solutionData: Partial<Solution> & SolutionInputDTO): Promise<Solution> {
        const solution: Solution = this.solutionRepo.create({
            ...solutionData
        })

        if (solutionData.problemId) {
            const problem = await this.sf.problemService.findOne({
                where: {
                    id: solutionData.problemId
                }
            })

            if (!problem) {
                throw new NotFoundException('relationship.notFound.problem')
            }

            solution.problem = problem
        }

        return this.solutionRepo.save(solution);
    }

    async delete(options: FindOptionsWhere<Solution>) {
        return this.solutionRepo.delete(options);
    }

    async getUserStatistics(userId: number): Promise<UserStatistics> {
        const solutions = await this.solutionRepo.find({
            where: {
                userId
            },
            relations: {
                problem: true
            }
        })

        if (!solutions.length) {
            return {
                easies: 0,
                mediums: 0,
                hards: 0,
                total: 0
            }
        }

        const uniqueProblems = new Map<number, Problem>();

        for (const solution of solutions) {
            uniqueProblems.set(solution.problemId, solution.problem);
        }

        const problemSolutions = new Map<number, number>();

        for (const solution of solutions) {
            const solutionsForProblem = problemSolutions.get(solution.problemId) ?? 0;

            problemSolutions.set(solution.problemId, solutionsForProblem + 1);
        }

        let easies = 0;
        let mediums = 0;
        let hards = 0;

        for (const [problemId, solutions] of problemSolutions) {
            const problem = uniqueProblems.get(problemId);

            if (problem.difficulty === 'easy') {
                easies += 1
            } else if (problem.difficulty === 'medium') {
                mediums += 1
            } else {
                hards += 1
            }
        }

        return {
            easies,
            mediums,
            hards,
            total: easies + mediums + hards
        }
    }
}