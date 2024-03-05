import { Allow, IsNotEmpty, IsStrongPassword } from "class-validator";


export class UserCreateDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 9,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 0,
        minSymbols: 0
    })
    password: string;

    @IsNotEmpty()
    email: string;

    @Allow()
    acceptedTermsAndConditions?: boolean;
}