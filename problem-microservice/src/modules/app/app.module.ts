import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { ProblemModule } from '../problem/problem.module';
import { UnitTestModule } from '../unit-test/unit-test.module';
import { dataSourceOptions } from 'database/data-source';
import { SolutionModule } from '../solution/solution.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    ProblemModule,
    UnitTestModule,
    SolutionModule,
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
