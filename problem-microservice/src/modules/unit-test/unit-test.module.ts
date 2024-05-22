import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitTest } from './unit-test.entity';
// import { UnitTestController } from './unit-test.controller';
import { UnitTestService } from './unit-test.service';
import { FactoryModule } from '../factory/factory.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([UnitTest]), forwardRef(() => FactoryModule), ConfigModule],
    exports: [TypeOrmModule, UnitTestService],
    controllers: [],
    providers: [UnitTestService],
})
export class UnitTestModule {}
