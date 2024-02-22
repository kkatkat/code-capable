import { Module } from '@nestjs/common';
import { RunnerModule } from '../runner/runner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { ProblemModule } from '../problem/problem.module';
import { dataSourceOptions } from 'database/data-source';

@Module({
  imports: [
    RunnerModule,
    ProblemModule,
    ConfigModule.forRoot({
      load: [config]
    }),
    TypeOrmModule.forRoot(dataSourceOptions)
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
