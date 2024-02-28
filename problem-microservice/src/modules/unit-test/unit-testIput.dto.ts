import { Allow, IsNotEmpty } from "class-validator";


export class UnitTestInputDTO {
    @IsNotEmpty()
    code: string;

    @Allow()
    visible?: boolean;

    @IsNotEmpty()
    problemId: number;
}