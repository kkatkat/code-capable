import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';
import { dataSourceOptions } from 'database/data-source';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { RmqModule } from '../rmq/rmq.module';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    UserModule,
    AuthModule,
    RmqModule,
    TypeOrmModule.forRoot(dataSourceOptions),
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
