import { Module, forwardRef } from '@nestjs/common';
import { Problem } from './problem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { FactoryModule } from '../factory/factory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Problem]), forwardRef(() => FactoryModule)],
  exports: [TypeOrmModule, ProblemService],
  controllers: [ProblemController],
  providers: [ProblemService],
})

export class ProblemModule {}
