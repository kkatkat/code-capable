import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { ProblemModule } from '../problem/problem.module';
import { UnitTestModule } from '../unit-test/unit-test.module';
import { dataSourceOptions } from 'database/data-source';
import { SolutionModule } from '../solution/solution.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    ProblemModule,
    UnitTestModule,
    SolutionModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    SentryModule.forRoot({
        enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'development',
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        release: 'v1.0',
        enableTracing: true
    })
  ],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useFactory: () => new SentryInterceptor({
        filters: [{
            type: HttpException,
            filter: (exception: HttpException) => 500 > exception.getStatus() // Only report http exceptions with status code 500 or higher
        }]
    })
  }],
})

export class AppModule { }
