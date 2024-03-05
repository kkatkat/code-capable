import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { FactoryModule } from "../factory/factory.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";


@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => FactoryModule)],
    exports: [TypeOrmModule, UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}