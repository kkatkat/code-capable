import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, forwardRef } from "@nestjs/common";
import { ServiceFactory } from "../factory/service-factory.service";
import { LoginRequest } from "./login-request.dto";
import { JwtUser } from "src/common/jwt-user";
import { User } from "../user/user.entity";
import * as jwt from 'jsonwebtoken';
import { LoginResponse } from "./login-response.dto";
import { ConfigService } from "@nestjs/config";
import { UserCreateDTO } from "../user/user-create.dto";
import * as bcrypt from 'bcrypt';
import { Equal } from "typeorm";



@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => ServiceFactory))
        private readonly sf: ServiceFactory,

        private readonly configService: ConfigService,
    ) { }

    async login(body: LoginRequest): Promise<LoginResponse> {
        const user = await this.sf.userService.findOneFull({
            where: {
                username: body.username
            }
        })

        if (!user) {
            throw new UnauthorizedException('Wrong username or password');
        }

        if (!user.password) {
            throw new UnauthorizedException('Please login with your provider')
        }

        if (user.username !== body.username) {
            throw new UnauthorizedException('Wrong username or password');
        }

        const passwordsMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordsMatch) {
            throw new UnauthorizedException();
        }

        const token = this.signJwt(user);

        delete user.password
        delete user.confirmationCode

        return {
            user,
            accessToken: token
        }
    }

    async register(body: UserCreateDTO): Promise<void> {
        if (!body.acceptedTermsAndConditions) {
            throw new ForbiddenException('You must accept the terms and conditions to register an account.')
        }

        const hashedPwd = await this.hashPassword(body.password);

        body.password = hashedPwd;

        await this.sf.userService.create(body);
    }

    signJwt(user: User): string {
        const payload: JwtUser = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            provider: user.provider,
            accountConfirmed: user.accountConfirmed,
            acceptedTermsAndConditions: user.acceptedTermsAndConditions,
            createdAt: user.createdAt
        }

        const privateKey = this.configService.get('jwtPrivateKey');

        if (!privateKey) {
            throw new InternalServerErrorException('Invalid JWT private key')
        }

        const token = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '10 days',
            issuer: 'CodeCapable',
            subject: user.id.toString(),
            audience: 'CodeCapable',
            keyid: '1'
        })

        return token
    }

    async hashPassword(rawPassword: string): Promise<string> {
        return bcrypt.hash(rawPassword, 10)
    }

    async checkToken(jwtUser: JwtUser): Promise<Omit<LoginResponse, 'accessToken'>> {
        const user = await this.sf.userService.findOne({
            where: {
                id: jwtUser.id
            }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return {
            user
        }
    }
}