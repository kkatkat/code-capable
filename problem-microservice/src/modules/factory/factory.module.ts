import { Module, forwardRef } from "@nestjs/common";
import { ServiceFactory } from "./service-factory.service";
import { UnitTestModule } from "../unit-test/unit-test.module";
import { ProblemModule } from "../problem/problem.module";
import { RunnerModule } from "../runner/runner.module";
import { SolutionModule } from "../solution/solution.module";


@Module({
    imports: [
        forwardRef(() => UnitTestModule),
        forwardRef(() => ProblemModule),
        forwardRef(() => RunnerModule),
        forwardRef(() => SolutionModule),
    ],
    providers: [ServiceFactory],
    exports: [ServiceFactory],
})
export class FactoryModule {}