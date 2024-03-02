import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitTest } from './unit-test.entity';
import { UnitTestController } from './unit-test.controller';
import { UnitTestService } from './unit-test.service';
import { ProblemModule } from '../problem/problem.module';
import { FactoryModule } from '../factory/factory.module';

@Module({
    imports: [TypeOrmModule.forFeature([UnitTest]), forwardRef(() => FactoryModule)],
    exports: [TypeOrmModule, UnitTestService],
    controllers: [UnitTestController],
    providers: [UnitTestService],
})
export class UnitTestModule {}
