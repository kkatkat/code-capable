import { Test, TestingModule } from '@nestjs/testing';
import { RunnerService } from './runner.service';
import { JwtUser } from 'src/common/jwt-user';
import { ForbiddenException } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from 'src/common/roles';
import { Problem, SolutionSubmission } from 'src/common/types';
import { RunResponse } from './runResponse.dto';
import { Observable } from 'rxjs';

describe('RunnerService', () => {
  let runnerService: RunnerService;
  let problemMicroservice: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RunnerService,
        {
          provide: 'PROBLEM_MICROSERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
        {
            provide: Observable,
            useValue: {
                subscribe: jest.fn(),
            },
        }
      ],
    }).compile();

    runnerService = module.get<RunnerService>(RunnerService);
    problemMicroservice = module.get<ClientProxy>('PROBLEM_MICROSERVICE');
  });

  describe('runCode', () => {
    const code = 'print("Hello, World!")';
    const problem = {
      id: 1,
      approved: true,
      unitTests: [
        {
          id: 1,
          code: 'test("Hello, World!")',
          visible: true,
          problemId: 1,
        },
      ],
    };

    const unapprovedProblem = {
        id: 1,
        approved: false,
        unitTests: [
          {
            id: 1,
            code: 'test("Hello, World!")',
            visible: true,
            problemId: 1,
          },
        ],
      };

    const user = {
      id: 1,
      username: 'testuser',
      role: Role.ADMIN,
    };

    it('should throw ForbiddenException if problem is not approved and user is not an admin', async () => {
      const nonAdminUser = {
        id: 2,
        username: 'nonadminuser',
        role: Role.USER,
      };

      await expect(runnerService.runCode(code, unapprovedProblem as any, nonAdminUser as any)).rejects.toThrow(ForbiddenException);
    });

    it('should run the code with unit tests if submit is true', async () => {
      const submit = true;
      const expectedOutput: RunResponse = {
        output: ['Test output'],
        error: false,
        submitted: submit,
      };

      jest.spyOn(PythonShell, 'runString').mockResolvedValue(['Test output']);
      jest.spyOn(problemMicroservice, 'send').mockReturnValue(new Observable());

      const result = await runnerService.runCode(code, problem as any, user as any, submit);

      expect(result).toEqual(expectedOutput);
      expect(PythonShell.runString).toHaveBeenCalledWith(expect.stringContaining(code));
      
    });

    it('should run the code with visible unit tests if submit is false', async () => {
      const submit = false;
      const expectedOutput: RunResponse = {
        output: ['Test output'],
        error: false,
        submitted: submit,
      };

      jest.spyOn(PythonShell, 'runString').mockResolvedValue(['Test output']);

      const result = await runnerService.runCode(code, problem as any, user as any, submit);

      expect(result).toEqual(expectedOutput);
      expect(PythonShell.runString).toHaveBeenCalledWith(expect.stringContaining(code));
    });

    it('should handle error if PythonShell.runString throws an error', async () => {
      const submit = true;
      const expectedOutput: RunResponse = {
        output: ['Error: Error output '],
        error: true,
      };

      jest.spyOn(PythonShell, 'runString').mockRejectedValue(new Error('Error output at PythonShell.parseError'));

      const result = await runnerService.runCode(code, problem as any, user as any, submit);

      expect(result).toEqual(expectedOutput);
      expect(PythonShell.runString).toHaveBeenCalledWith(expect.stringContaining(code));
    });

    it('should send solution submission if submit is true and there is no error', async () => {
      const submit = true;
      const originalCode = 'print("Hello, World!")';
      const submission: SolutionSubmission = {
        userId: user.id,
        code: originalCode,
        problemId: problem.id,
        userName: user.username,
      };

      jest.spyOn(PythonShell, 'runString').mockResolvedValue(['Test output']);
      jest.spyOn(problemMicroservice, 'send').mockReturnValue(new Observable());

      await runnerService.runCode(code, problem as any, user as any, submit);

      expect(problemMicroservice.send).toHaveBeenCalledWith('solution_submitted', submission);
    });
  });

  describe('sanitizeOutput', () => {
    it('should replace file paths in output with "File "solution.py""', () => {
      const output: string[] = [
        'File "/path/to/file1"',
        'File "/path/to/file2"',
      ];
      const expectedOutput: string[] = [
        'File "solution.py"',
        'File "solution.py"',
      ];

      const result = runnerService.sanitizeOutput(output);

      expect(result).toEqual(expectedOutput);
    });
  });
});