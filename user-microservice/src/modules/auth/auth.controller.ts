import { Body, Controller, ForbiddenException, ImATeapotException, Inject, Param, Post, Req, UseGuards, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./login-request.dto";
import { UserCreateDTO } from "../user/user-create.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { ServiceFactory } from "../factory/service-factory.service";
import { ClientProxy } from "@nestjs/microservices";
import { GitHubService } from "./github.service";



@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(forwardRef(() => ServiceFactory))
        private readonly sf: ServiceFactory,
        @Inject('PROBLEM_MICROSERVICE')
        private problemMicroservice: ClientProxy,
        private gitHubService: GitHubService,
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

        try {
            await this.sf.userService.delete({
                id: user.id
            })
        } catch (e) {
            throw new ForbiddenException('Your account could not be deleted at this time. Please try again later.');
        }

        this.problemMicroservice.send<number>('user_deleted', user.id).subscribe();
    }

    @UseGuards(AuthGuard)
    @Post('/check-token')
    async checkToken(@Req() req: Request) {
        const jwtUser = req['user'] as JwtUser;
        
        return this.authService.checkToken(jwtUser);
    }

    @Post('github/token/:code')
    async signInWithGitHub(@Param('code') code: string) {
        return this.gitHubService.doGitHubSignIn(code);
    }

}