import { IsNotEmpty } from "class-validator";

export class RunRequest {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    problemId: string;
}