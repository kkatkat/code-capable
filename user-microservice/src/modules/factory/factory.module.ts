import { Module, forwardRef } from "@nestjs/common";
import { ServiceFactory } from "./service-factory.service";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
    ],
    providers: [ServiceFactory],
    exports: [ServiceFactory],
})
export class FactoryModule {}