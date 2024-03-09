import { Module, forwardRef } from '@nestjs/common';
import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';
import { FactoryModule } from '../factory/factory.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [forwardRef(() => FactoryModule), ConfigModule],
  controllers: [RunnerController],
  providers: [RunnerService],
  exports: [RunnerService]
})

export class RunnerModule {}
