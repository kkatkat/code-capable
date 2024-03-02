import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UnitTestService } from "../unit-test/unit-test.service";
import { ProblemService } from "../problem/problem.service";
import { RunnerService } from "../runner/runner.service";


@Injectable()
export class ServiceFactory {
    constructor(
        @Inject(forwardRef(() => UnitTestService))
        public readonly unitTestService: UnitTestService,

        @Inject(forwardRef(() => ProblemService))
        public readonly problemService: ProblemService,

        @Inject(forwardRef(() => RunnerService))
        public readonly runnerService: RunnerService,
    ) {}
}