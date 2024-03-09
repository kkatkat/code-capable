import { Module } from '@nestjs/common';
import { RunnerModule } from '../runner/runner.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    RunnerModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
