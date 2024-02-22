import { Body, Controller, Get, Post } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { RunRequest } from './runRequest.dto';

@Controller('runner')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}

  @Post('run')
  async runCode(@Body() body: RunRequest): Promise<any> {
    return await this.runnerService.runCode(body.code, body.problemId)
  }
}
