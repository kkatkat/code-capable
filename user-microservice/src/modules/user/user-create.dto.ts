import { Allow, IsNotEmpty, IsStrongPassword } from "class-validator";


export class UserCreateDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 9
    })
    password: string;

    @IsNotEmpty()
    email: string;

    @Allow()
    acceptedTermsAndConditions?: boolean;
}