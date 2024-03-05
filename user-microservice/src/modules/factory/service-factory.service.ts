import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class ServiceFactory {
    constructor(
        @Inject(forwardRef(() => UserService))
        public readonly userService: UserService,
    ) {}
}