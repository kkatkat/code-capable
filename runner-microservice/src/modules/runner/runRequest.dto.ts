import { Allow, IsNotEmpty } from "class-validator";

export class RunRequest {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    problemId: number;

    @Allow()
    submit?: boolean;
}