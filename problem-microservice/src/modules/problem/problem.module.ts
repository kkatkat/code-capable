import { Module } from '@nestjs/common';
import { Problem } from './problem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  exports: [TypeOrmModule],
  controllers: [ProblemController],
  providers: [ProblemService],
})

export class ProblemModule {}
