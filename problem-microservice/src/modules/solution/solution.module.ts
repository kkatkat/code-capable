import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Solution } from "./solution.entity";
import { FactoryModule } from "../factory/factory.module";
import { SolutionService } from "./solution.service";
import { SolutionController } from "./solution.controller";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports: [
        TypeOrmModule.forFeature([Solution]),
        forwardRef(() => FactoryModule),
        ConfigModule
    ],
    exports: [TypeOrmModule, SolutionService],
    controllers: [SolutionController],
    providers: [SolutionService],
})
export class SolutionModule {}