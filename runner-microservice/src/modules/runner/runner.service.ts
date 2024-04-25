import { ForbiddenException, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { RunResponse } from './runResponse.dto';
import {PythonShell} from 'python-shell';
import { Problem, SolutionSubmission, UnitTest } from 'src/common/types';
import { ClientProxy } from '@nestjs/microservices';
import { JwtUser } from 'src/common/jwt-user';
import template from './template';
import { Role } from 'src/common/roles';
import axios, { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RunnerService {
  constructor(
    @Inject('PROBLEM_MICROSERVICE')
    private problemMicroservice: ClientProxy,
    private readonly configService: ConfigService
  ) {}


  async runCode(code: string, problem: Problem, user: JwtUser, submit?: boolean): Promise<RunResponse> {
    if (!problem.approved && user.role !== Role.ADMIN) {
        throw new ForbiddenException('This problem has not been approved yet. Please try again later.')
    }
    
    const originalCode = code;
    
    problem.unitTests.forEach((unitTest) => {
        if (submit) {
            code += `\n${unitTest.code}`
        } else {
            if (unitTest.visible) {
                code += `\n${unitTest.code}`
            }
        }
    })

    
    const result: RunResponse = await PythonShell.runString(code)
    .then((messages) => {
        return {output: messages, error: false, submitted: submit}
    }).catch((error) => {
        return {
            output: error.traceback ? [error.logs.join('\n'), error.traceback] : [error.stack.split('at PythonShell.parseError')[0]], 
            error: true
        }
    })

    if (submit && !result.error) {
      const submission: SolutionSubmission = {
        userId: user.id,
        code: originalCode,
        problemId: problem.id,
        userName: user.username,
      }

      this.problemMicroservice.send<SolutionSubmission>('solution_submitted', submission).subscribe();
    }

    return result;
  }

  private appendUnitTests(code: string, unitTests: UnitTest[]): string {
    code = template.replace('#solution', `\n${code}`);
    code = code.replace('#start-test', `\n\t${unitTests.map(test => test.code).join('\n\t')}`);
    return code;

  }

  sanitizeOutput(output: string[]): string[] {
    const sanitizedArray = [];

    for (const item of [...output]) {
      sanitizedArray.push(item.replace(/File ".*?"/g, 'File "solution.py"'))
    }

    return sanitizedArray;
  }

  async runCodeWithJudge(code: string, problem: Problem, user: JwtUser, submit?: boolean) {
    const judgeKey = this.configService.get('JUDGE_KEY');

    if (!judgeKey) {
        throw new ServiceUnavailableException('This service is currently unavailable. If this persists, please contact the administrator.')
    }

    if (!problem.approved && user.role !== Role.ADMIN) {
        throw new ForbiddenException('This problem has not been approved yet. Please try again later.')
    }
    
    const originalCode = code;
    
    problem.unitTests.forEach((unitTest) => {
        if (submit) {
            code += `\n${unitTest.code}`
        } else {
            if (unitTest.visible) {
                code += `\n${unitTest.code}`
            }
        }
    })

    const judgeRequest: AxiosRequestConfig = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: false,
            wait: false,
        },
        data: {
            source_code: code,
            language_id: 71,
        },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': judgeKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }

    }

    const response = await axios.request(judgeRequest)
  }
}
