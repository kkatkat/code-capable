import { Module } from '@nestjs/common';
import { Problem } from './problem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [],
})

export class ProblemModule {}
