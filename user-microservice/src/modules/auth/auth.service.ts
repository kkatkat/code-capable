import { Inject, Injectable, InternalServerErrorException, UnauthorizedException, forwardRef } from "@nestjs/common";
import { ServiceFactory } from "../factory/service-factory.service";
import { LoginRequest } from "./login-request.dto";
import { JwtUser } from "src/common/jwt-user";
import { User } from "../user/user.entity";
import * as jwt from 'jsonwebtoken';
import { LoginResponse } from "./login-response.dto";
import { ConfigService } from "@nestjs/config";



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

        if (user.password !== body.password) {
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

    hashPassword(rawPassword: string): string {
        

        return '123';
    }
}