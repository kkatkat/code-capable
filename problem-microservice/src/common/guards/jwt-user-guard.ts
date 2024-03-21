import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { extractTokenFromRequest } from "../lib";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtUserGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = extractTokenFromRequest(request);

        if (!token) {
            Promise.resolve(true);
        }

        const publicKey = this.configService.get('jwtPublicKey')

        try {
            const payload = jwt.verify(token, publicKey, {
                algorithms: ['RS256'],

            })
            request['user'] = payload

        } catch(error) {
            request['user'] = undefined
        }

        return Promise.resolve(true);
    }

}
