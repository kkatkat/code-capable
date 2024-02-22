import { Module } from '@nestjs/common';
import { RunnerModule } from '../runner/runner.module';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';

@Module({
  imports: [RunnerModule, ConfigModule.forRoot({
    load: [config]
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
