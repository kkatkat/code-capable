import { Allow, IsIn, IsNotEmpty, MinLength } from "class-validator";
import { difficulties } from "./problem.entity";
import { UnitTestInputDTO } from "../unit-test/unit-testIput.dto";
import { UnitTest } from "../unit-test/unit-test.entity";

export class ProblemInputDTO {
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @MinLength(5)
    description: string;

    @Allow()
    constraints?: string;

    @IsNotEmpty()
    @MinLength(5)
    starterCode: string;

    @IsNotEmpty()
    @IsIn(difficulties)
    difficulty: string;

    @IsNotEmpty()
    creatorId: number;

    @IsNotEmpty()
    unitTests: UnitTest[];
}