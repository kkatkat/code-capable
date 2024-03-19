import { IsNotEmpty } from "class-validator";

export class SolutionInputDTO {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    problemId: number;

    @IsNotEmpty()
    userName: string;

}