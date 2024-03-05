import { Allow, IsNotEmpty } from "class-validator";


export class UserCreateDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    email: string;

    @Allow()
    acceptedTermsAndConditions?: boolean;
}