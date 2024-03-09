import { Module, forwardRef } from '@nestjs/common';
import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';
import { FactoryModule } from '../factory/factory.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [forwardRef(() => FactoryModule), ConfigModule, RmqModule],
  controllers: [RunnerController],
  providers: [RunnerService],
  exports: [RunnerService]
})

export class RunnerModule {}
