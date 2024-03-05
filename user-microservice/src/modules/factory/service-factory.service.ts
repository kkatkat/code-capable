import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ServiceFactory {
    constructor(
        @Inject(forwardRef(() => UserService))
        public readonly userService: UserService,

        @Inject(forwardRef(() => AuthService))
        public readonly authService: AuthService,
    ) {}
}