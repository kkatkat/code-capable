import { Allow, IsIn, IsNotEmpty, MinLength } from "class-validator";
import { Difficulty, difficulties } from "./problem.entity";

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
    difficulty: Difficulty;

    @IsNotEmpty()
    creatorId: number;
}