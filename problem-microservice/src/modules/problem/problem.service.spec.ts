import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemService } from './problem.service';
import { Problem } from './problem.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProblemInputDTO } from './problemInput.dto';
import { ProblemUpdateDTO } from './problemUpdate.dto';
import { UnitTest } from '../unit-test/unit-test.entity';

describe('ProblemService', () => {
    let service: ProblemService;
    let problemRepo: Repository<Problem>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProblemService,
                {
                    provide: getRepositoryToken(Problem),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProblemService>(ProblemService);
        problemRepo = module.get<Repository<Problem>>(getRepositoryToken(Problem));
    });

    describe('findOne', () => {
        it('should return a problem', async () => {
            const options = { where: { id: 1 } };
            const problem = new Problem();
            jest.spyOn(problemRepo, 'findOne').mockResolvedValue(problem);

            const result = await service.findOne(options);

            expect(result).toBe(problem);
            expect(problemRepo.findOne).toHaveBeenCalledWith(options);
        });
    });

    describe('findAndCount', () => {
        it('should return an array of problems and count', async () => {
            const options = {};
            const problems = [new Problem(), new Problem()];
            const count = problems.length;
            jest.spyOn(problemRepo, 'findAndCount').mockResolvedValue([problems, count]);

            const result = await service.findAndCount(options);

            expect(result).toEqual([problems, count]);
            expect(problemRepo.findAndCount).toHaveBeenCalledWith(options);
        });
    });

    describe('find', () => {
        it('should return an array of problems', async () => {
            const options = {};
            const problems = [new Problem(), new Problem()];
            jest.spyOn(problemRepo, 'find').mockResolvedValue(problems);

            const result = await service.find(options);

            expect(result).toBe(problems);
            expect(problemRepo.find).toHaveBeenCalledWith(options);
        });
    });

    describe('count', () => {
        it('should return the count of problems', async () => {
            const options = {};
            const count = 5;
            jest.spyOn(problemRepo, 'count').mockResolvedValue(count);

            const result = await service.count(options);

            expect(result).toBe(count);
            expect(problemRepo.count).toHaveBeenCalledWith(options);
        });
    });

    describe('create', () => {
        it('should create a problem', async () => {
            const unitTests: UnitTest[] = [new UnitTest(), new UnitTest()]
            const problemData: ProblemInputDTO = { name: 'Test Problem', description: 'Test Description', creatorId: 1, difficulty: 'easy', creatorName: 'Test User', starterCode: 'Test Starter Code', unitTests: unitTests};
            const problem = new Problem();
            jest.spyOn(problemRepo, 'create').mockReturnValue(problem);
            jest.spyOn(problemRepo, 'save').mockResolvedValue(problem);

            const result = await service.create(problemData);

            expect(result).toBe(problem);
            expect(problemRepo.create).toHaveBeenCalledWith(problemData);
            expect(problemRepo.save).toHaveBeenCalledWith(problem);
        });
    });

    describe('update', () => {
        it('should update a problem', async () => {
            const problemData: ProblemUpdateDTO = { id: 1, name: 'Updated Problem', description: 'Updated Description' };
            const problem = new Problem();
            jest.spyOn(service, 'findOne').mockResolvedValue(problem);
            jest.spyOn(problemRepo, 'save').mockResolvedValue(problem);

            const result = await service.update(problemData);

            expect(result).toBe(problem);
            expect(service.findOne).toHaveBeenCalledWith({ where: { id: problemData.id } });
            expect(problemRepo.save).toHaveBeenCalledWith(problemData);
        });

        it('should throw NotFoundException if problem not found', async () => {
            const problemData: ProblemUpdateDTO = { id: 1, name: 'Updated Problem', description: 'Updated Description' };
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            await expect(service.update(problemData)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith({ where: { id: problemData.id } });
        });

        it('should throw BadRequestException if invalid difficulty provided', async () => {
            const problemData: ProblemUpdateDTO = { id: 1, name: 'Updated Problem', description: 'Updated Description', difficulty: 'invalid' };
            const problem = new Problem();
            jest.spyOn(service, 'findOne').mockResolvedValue(problem);

            await expect(service.update(problemData)).rejects.toThrow(BadRequestException);
            expect(service.findOne).toHaveBeenCalledWith({ where: { id: problemData.id } });
        });
    });

    describe('delete', () => {
        it('should delete a problem', async () => {
            const options = { id: 1 };
            jest.spyOn(problemRepo, 'delete').mockResolvedValue(Promise.resolve({ affected: 1, raw: undefined}));

            const result = await service.delete(options);

            expect(result).toEqual({ affected: 1 });
            expect(problemRepo.delete).toHaveBeenCalledWith(options);
        });
    });
});