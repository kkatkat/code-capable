import { HttpException, Module } from '@nestjs/common';
import { RunnerModule } from '../runner/runner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/config/config';
import { RmqModule } from '../rmq/rmq.module';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    RunnerModule,
    RmqModule,
    SentryModule.forRoot({
        enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV !== 'development',
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        release: 'v1.0',
        enableTracing: true,
        debug: false,
        maxBreadcrumbs: 10,
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
