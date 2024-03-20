import { Module, forwardRef } from "@nestjs/common";
import { FactoryModule } from "../factory/factory.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { RmqModule } from "../rmq/rmq.module";
import { GitHubService } from "./github.service";



@Module({
    imports: [forwardRef(() => FactoryModule), ConfigModule, RmqModule],
    exports: [AuthService, GitHubService],
    controllers: [AuthController],
    providers: [AuthService, GitHubService]
})
export class AuthModule {}