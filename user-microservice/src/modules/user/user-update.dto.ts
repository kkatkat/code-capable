import { Allow, IsNotEmpty } from "class-validator";


export class UserUpdateDTO {
    @IsNotEmpty()
    id: number;

    @Allow()
    pfp?: string;

    @Allow()
    bio?: string;
}