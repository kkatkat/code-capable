import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Solution } from "./solution.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ServiceFactory } from "../factory/service-factory.service";
import { SolutionInputDTO } from "./solution-input.dto";


@Injectable()
export class SolutionService {
    constructor(
        @InjectRepository(Solution)
        protected readonly solutionRepo: Repository<Solution>,

        @Inject(forwardRef(() => ServiceFactory))
        protected readonly sf: ServiceFactory,
    ) {}

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
}