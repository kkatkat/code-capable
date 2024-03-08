import { Body, Controller, Inject, Post, Req, UseGuards, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./login-request.dto";
import { UserCreateDTO } from "../user/user-create.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { ServiceFactory } from "../factory/service-factory.service";



@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(forwardRef(() => ServiceFactory))
        private readonly sf: ServiceFactory
    ) { }

    @Post('/login')
    async login(@Body() body: LoginRequest) {
        return await this.authService.login(body);
    }

    @Post('/register')
    async register(@Body() body: UserCreateDTO) {
        return await this.authService.register(body);
    }

    @UseGuards(AuthGuard)
    @Post('/delete-account')
    async deleteAccount(@Req() req: Request) {
        const user = req['user'] as JwtUser

        await this.sf.userService.delete({
            id: user.id
        })
    }

}