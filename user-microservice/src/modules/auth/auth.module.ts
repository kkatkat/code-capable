import { Module, forwardRef } from "@nestjs/common";
import { FactoryModule } from "../factory/factory.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "@nestjs/microservices";
import { RmqModule } from "../rmq/rmq.module";



@Module({
    imports: [forwardRef(() => FactoryModule), ConfigModule, RmqModule],
    exports: [AuthService],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}