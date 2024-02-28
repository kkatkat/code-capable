import { Allow, IsNotEmpty } from "class-validator";


export class UnitTestUpdateDTO {
    @IsNotEmpty()
    id: number;

    @Allow()
    code?: string;

    @Allow()
    visible?: boolean;
}