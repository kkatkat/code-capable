import { Module, forwardRef } from "@nestjs/common";
import { FactoryModule } from "../factory/factory.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";



@Module({
    imports: [forwardRef(() => FactoryModule), ConfigModule],
    exports: [AuthService],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}