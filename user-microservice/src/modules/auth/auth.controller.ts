import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./login-request.dto";
import { UserCreateDTO } from "../user/user-create.dto";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async login(@Body() body: LoginRequest) {
        return await this.authService.login(body);
    }

    @Post('/register')
    async register(@Body() body: UserCreateDTO) {
        return await this.authService.register(body);
    }
}