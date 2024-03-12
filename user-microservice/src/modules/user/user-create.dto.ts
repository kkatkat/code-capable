import { Allow, IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";


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
    @IsEmail()
    email: string;

    @Allow()
    acceptedTermsAndConditions?: boolean;
}