import { Module, forwardRef } from "@nestjs/common";
import { ServiceFactory } from "./service-factory.service";

@Module({
    imports: [
        //forwardRef(() => UserModule),
    ],
    providers: [ServiceFactory],
    exports: [ServiceFactory],
})
export class FactoryModule {}