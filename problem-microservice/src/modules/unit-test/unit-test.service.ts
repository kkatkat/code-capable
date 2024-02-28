import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UnitTest } from "./unit-test.entity";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { UnitTestInputDTO } from "./unit-testIput.dto";
import { Problem } from "../problem/problem.entity";
import { UnitTestUpdateDTO } from "./unit-testUpdate.dto";
import { ProblemService } from "../problem/problem.service";


@Injectable()
export class UnitTestService {
    constructor(
        @InjectRepository(UnitTest)
        protected readonly unitTestRepo: Repository<UnitTest>,
        protected readonly problemService: ProblemService
    ) {}

    async findOne(options: FindOneOptions<UnitTest>): Promise<UnitTest> {
        return this.unitTestRepo.findOne(options);
    }

    async find(options?: FindManyOptions<UnitTest>): Promise<UnitTest[]> {
        return this.unitTestRepo.find(options);
    }

    async count(options?: FindManyOptions<UnitTest>) {
        return this.unitTestRepo.count(options);
    }

    async create(unitTestData: Partial<UnitTest> & UnitTestInputDTO): Promise<UnitTest> {
        const unitTest: UnitTest = this.unitTestRepo.create({
            ...unitTestData
        });

        if (unitTestData.problemId) {
            const problem = await this.problemService.findOne({
                where: {
                    id: unitTestData.problemId
                }
            })

            if (!problem) {
                throw new NotFoundException('relationship.notFound.problem')
            }

            unitTest.problem = problem
        }

        return this.unitTestRepo.save(unitTest);
    }

    async update(unitTestData: Partial<UnitTest> & UnitTestUpdateDTO): Promise<UnitTest> {
        if (!(await this.findOne({where: {id:unitTestData.id}}))) {
            throw new NotFoundException();
        }

        const unitTest: Partial<UnitTest> = unitTestData;

        // TODO checks for relations (see duo)

        return this.unitTestRepo.save(unitTest);
    }

    async delete(options: FindOptionsWhere<UnitTest>) {
        return this.unitTestRepo.delete(options);
    }
    

}