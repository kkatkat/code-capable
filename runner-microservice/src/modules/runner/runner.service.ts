import { Injectable } from '@nestjs/common';
import { RunResponse } from './runResponse.dto';
import {PythonShell} from 'python-shell';
import { ConfigService } from '@nestjs/config';
import { Problem } from 'src/common/types';

@Injectable()
export class RunnerService {
  async runCode(code: string, problem: Problem): Promise<RunResponse> {
    problem.unitTests.forEach((unitTest) => {
        code += `\n${unitTest.code}`
    })

    console.log(code);
    

    const result: RunResponse = await PythonShell.runString(code)
    .then((messages) => {
        return {output: messages, error: false}
    }).catch((error) => {
        return {output: [error.stack], error: true}
    })

    return result;
  }
}
