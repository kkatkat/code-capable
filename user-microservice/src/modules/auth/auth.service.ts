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
import axios from "axios";

const GOOGLE_HASH_PWD = 'https://europe-west4-codecapable.cloudfunctions.net/hash-password'
const GOOGLE_COMPARE_PWD = 'https://europe-west4-codecapable.cloudfunctions.net/compare-password'
const SECRET_KEY = process.env.SECRET_KEY

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

        const passwordsMatch = await this.comparePassword(body.password, user.password);

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
        let hash: string | null = null;

        if (SECRET_KEY) {
            await axios.post(GOOGLE_HASH_PWD, {
                password: rawPassword,
                secret: SECRET_KEY
            }).then((response) => {
                hash = response.data.hash
            }).catch((error) => {
                console.error(error);
                hash = null;
            })
        } else {
            hash = await bcrypt.hash(rawPassword, 10);
        }

        if (!hash) {
            throw new InternalServerErrorException('Unknown error');
        }

        return hash;
    }

    async comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
        let match: boolean | null = null;

        if (SECRET_KEY) {
            await axios.post(GOOGLE_COMPARE_PWD, {
                raw: rawPassword,
                hashed: hashedPassword,
                secret: SECRET_KEY
            }).then((response) => {
                match = response.data.match
            }).catch((error) => {
                console.error(error);
                match = null;
            })
        } else {
            match = await bcrypt.compare(rawPassword, hashedPassword);
        }

        if (match === null) {
            throw new InternalServerErrorException('Unknown error 2');
        }

        return match;
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