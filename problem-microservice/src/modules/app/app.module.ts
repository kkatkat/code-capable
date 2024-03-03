import { Module } from '@nestjs/common';
import { RunnerModule } from '../runner/runner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { ProblemModule } from '../problem/problem.module';
import { UnitTestModule } from '../unit-test/unit-test.module';
import { dataSourceOptions } from 'database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    RunnerModule,
    ProblemModule,
    UnitTestModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
