import { Body, Controller, Get, Inject, NotFoundException, Post } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { RunRequest } from './runRequest.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Problem } from 'src/common/types';

@Controller('runner')
export class RunnerController {
  constructor(
    private readonly runnerService: RunnerService, 
    @Inject('PROBLEM_MICROSERVICE')
    private problemMicroservice: ClientProxy,
  ) { }

  @Post('run')
  async runCode(@Body() body: RunRequest): Promise<any> {
    const problem: Problem = await this.problemMicroservice.send('get_problem', body.problemId).toPromise().catch(e => {
      throw new NotFoundException('Problem not found')
    })

    return await this.runnerService.runCode(body.code, problem)
  }
}
