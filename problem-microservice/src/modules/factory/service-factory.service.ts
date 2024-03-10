import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UnitTestService } from "../unit-test/unit-test.service";
import { ProblemService } from "../problem/problem.service";
import { SolutionService } from "../solution/solution.service";


@Injectable()
export class ServiceFactory {
    constructor(
        @Inject(forwardRef(() => UnitTestService))
        public readonly unitTestService: UnitTestService,

        @Inject(forwardRef(() => ProblemService))
        public readonly problemService: ProblemService,

        @Inject(forwardRef(() => SolutionService))
        public readonly solutionService: SolutionService,
    ) {}
}