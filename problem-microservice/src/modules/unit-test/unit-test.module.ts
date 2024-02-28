import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitTest } from './unit-test.entity';
import { UnitTestController } from './unit-test.controller';
import { UnitTestService } from './unit-test.service';
import { ProblemModule } from '../problem/problem.module';

@Module({
    imports: [TypeOrmModule.forFeature([UnitTest]), ProblemModule],
    exports: [TypeOrmModule],
    controllers: [UnitTestController],
    providers: [UnitTestService],
})
export class UnitTestModule {}
