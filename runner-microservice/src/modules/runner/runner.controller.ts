import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { RunRequest } from './runRequest.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Problem } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth-guard';
import { JwtUser } from 'src/common/jwt-user';

@Controller('runner')
export class RunnerController {
  constructor(
    private readonly runnerService: RunnerService, 
    @Inject('PROBLEM_MICROSERVICE')
    private problemMicroservice: ClientProxy,
  ) { }

  @UseGuards(AuthGuard)
  @Post('run')
  async runCode(@Body() body: RunRequest, @Req() req: Request): Promise<any> {
    const user = req['user'] as JwtUser;

    if (!body.problemId || !body.code.trim()) {
        throw new BadRequestException('Invalid request')
    }

    const problem: Problem = await this.problemMicroservice.send('get_problem', body.problemId).toPromise().catch(e => {
      throw new NotFoundException('Problem not found')
    })

    const response =  await this.runnerService.runCode(body.code, problem, user, body.submit);
    
    if (response.output) {
        response.output = this.runnerService.sanitizeOutput(response.output);
    }

    return response;
  }
}
