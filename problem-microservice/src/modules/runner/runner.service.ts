import { Injectable } from '@nestjs/common';
import { RunResponse } from './runResponse.dto';
import {PythonShell} from 'python-shell';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RunnerService {
  async runCode(code: string, problemId: string): Promise<RunResponse> {
    const result: RunResponse = await PythonShell.runString(code)
    .then((messages) => {
        return {output: messages, error: false}
    }).catch((error) => {
        return {output: [error.stack], error: true}
    })

    return result;
  }
}
