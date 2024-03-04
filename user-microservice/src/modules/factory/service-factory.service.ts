import { Inject, Injectable, forwardRef } from "@nestjs/common";

@Injectable()
export class ServiceFactory {
    constructor(
        // @Inject(forwardRef(() => UserService))
        // public readonly userService: UserService,
    ) {}
}