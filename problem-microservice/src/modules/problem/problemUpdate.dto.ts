import { Allow, IsNotEmpty } from "class-validator";
import { Difficulty } from "./problem.entity";

export class ProblemUpdateDTO {
    @IsNotEmpty()
    id: number

    @Allow()
    name?: string;

    @Allow()
    description?: string;

    @Allow()
    starterCode?: string;

    @Allow()
    constraints?: string;

    @Allow()
    approved?: boolean;

    @Allow()
    difficulty?: string;
}