import { IsIn, IsNotEmpty } from "class-validator";
import { Difficulty, difficulties } from "./problem.entity";

export class ProblemUpdateDTO {
    @IsNotEmpty()
    id: number

    name?: string;

    description?: string;

    starterCode?: string;

    constraints?: string;

    approved?: boolean;

    @IsIn(difficulties)
    difficulty?: Difficulty;

    creatorId?: number;
}