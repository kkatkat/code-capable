import { Inject, Injectable } from '@nestjs/common';
import { RunResponse } from './runResponse.dto';
import {PythonShell} from 'python-shell';
import { Problem, SolutionSubmission } from 'src/common/types';
import { ClientProxy } from '@nestjs/microservices';
import { JwtUser } from 'src/common/jwt-user';

@Injectable()
export class RunnerService {
  constructor(
    @Inject('PROBLEM_MICROSERVICE')
    private problemMicroservice: ClientProxy,
  ) {}


  async runCode(code: string, problem: Problem, user: JwtUser, submit?: boolean): Promise<RunResponse> {
    const originalCode = code;
    
    problem.unitTests.forEach((unitTest) => {
        code += `\n${unitTest.code}`
    })
    
    const result: RunResponse = await PythonShell.runString(code)
    .then((messages) => {
        return {output: messages, error: false}
    }).catch((error) => {
        return {output: [error.stack], error: true}
    })

    if (submit && !result.error) {
      const submission: SolutionSubmission = {
        userId: user.id,
        code: originalCode,
        problemId: problem.id,
      }

      this.problemMicroservice.emit<SolutionSubmission>('solution_submitted', submission);
    }

    return result;
  }
}
