import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken'
import { JwtUser } from "../jwt-user";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException()
        }

        const publicKey = this.configService.get('jwtPublicKey')

        try {
            const payload = jwt.verify(token, publicKey, {
                algorithms: ['RS256'],

            })

            request['user'] = payload

        } catch(error) {
            throw new UnauthorizedException('token.invalid');
        }

        return Promise.resolve(true);
    }

    private extractTokenFromRequest(request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    
}