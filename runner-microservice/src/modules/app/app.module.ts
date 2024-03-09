import { Module } from '@nestjs/common';
import { RunnerModule } from '../runner/runner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/config/config';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    RunnerModule,
    RmqModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
