import { Module, forwardRef } from "@nestjs/common";
import { ServiceFactory } from "./service-factory.service";
import { RunnerModule } from "../runner/runner.module";


@Module({
    imports: [
        forwardRef(() => RunnerModule),
    ],
    providers: [ServiceFactory],
    exports: [ServiceFactory],
})
export class FactoryModule {}