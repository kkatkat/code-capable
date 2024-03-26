import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { Solution } from './solution.entity';
import { ServiceFactory } from '../factory/service-factory.service';
import { Problem } from '../problem/problem.entity';
import { SolutionInputDTO } from './solution-input.dto';


describe('SolutionService', () => {
    let service: SolutionService;
    let solutionRepo: Repository<Solution>;
    let sf: ServiceFactory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SolutionService,
                {
                    provide: getRepositoryToken(Solution),
                    useClass: Repository,
                },
                {
                    provide: ServiceFactory,
                    useValue: {
                        problemService: {
                            findOne: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<SolutionService>(SolutionService);
        solutionRepo = module.get<Repository<Solution>>(getRepositoryToken(Solution));
        sf = module.get<ServiceFactory>(ServiceFactory);
    });

    describe('findOne', () => {
        it('should return a solution', async () => {
            const options = { where: { id: 1 } };
            const solution = new Solution();
            jest.spyOn(solutionRepo, 'findOne').mockResolvedValue(solution);

            const result = await service.findOne(options);

            expect(result).toBe(solution);
            expect(solutionRepo.findOne).toHaveBeenCalledWith(options);
        });
    });

    describe('find', () => {
        it('should return an array of solutions', async () => {
            const options = {};
            const solutions = [new Solution(), new Solution()];
            jest.spyOn(solutionRepo, 'find').mockResolvedValue(solutions);

            const result = await service.find(options);

            expect(result).toBe(solutions);
            expect(solutionRepo.find).toHaveBeenCalledWith(options);
        });
    });

    describe('findAndCount', () => {
        it('should return an array of solutions and count', async () => {
            const options = {};
            const solutions = [new Solution(), new Solution()];
            const count = solutions.length;
            jest.spyOn(solutionRepo, 'findAndCount').mockResolvedValue([solutions, count]);

            const result = await service.findAndCount(options);

            expect(result).toEqual([solutions, count]);
            expect(solutionRepo.findAndCount).toHaveBeenCalledWith(options);
        });
    });

    describe('count', () => {
        it('should return the count of solutions', async () => {
            const options = {};
            const count = 5;
            jest.spyOn(solutionRepo, 'count').mockResolvedValue(count);

            const result = await service.count(options);

            expect(result).toBe(count);
            expect(solutionRepo.count).toHaveBeenCalledWith(options);
        });
    });

    describe('create', () => {
        it('should create a solution', async () => {
            const solutionData = { problemId: 1, code: '', userId: 1, userName: '' };
            const problem = new Problem();
            const solution = new Solution();
            jest.spyOn(sf.problemService, 'findOne').mockResolvedValue(problem);
            jest.spyOn(solutionRepo, 'create').mockReturnValue(solution);
            jest.spyOn(solutionRepo, 'save').mockResolvedValue(solution);

            const result = await service.create(solutionData);

            expect(result).toBe(solution);
            expect(sf.problemService.findOne).toHaveBeenCalledWith({ where: { id: solutionData.problemId } });
            expect(solutionRepo.create).toHaveBeenCalledWith(solutionData);
            expect(solutionRepo.save).toHaveBeenCalledWith(solution);
        });

        it('should throw NotFoundException if problem not found', async () => {
            const solutionData: SolutionInputDTO = { problemId: 1, code: '', userId: 1, userName: '' };
            jest.spyOn(sf.problemService, 'findOne').mockResolvedValue(null);
            jest.spyOn(solutionRepo, 'create').mockReturnValue(solutionData as Solution);

            try {
                await service.create(solutionData);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe('relationship.notFound.problem');
            }

            expect(sf.problemService.findOne).toHaveBeenCalledWith({ where: { id: solutionData.problemId } });
        });
    });

    describe('delete', () => {
        it('should delete solutions', async () => {
            const options = { id: 1 };
            jest.spyOn(solutionRepo, 'delete').mockResolvedValue(Promise.resolve<DeleteResult>({ affected: 1, raw: {} }));

            const result = await service.delete(options);

            expect(result).toEqual({ affected: 1, raw: {} });
            expect(solutionRepo.delete).toHaveBeenCalledWith(options);
        });
    });

    describe('getUserStatistics', () => {
        it('should return user statistics', async () => {
            const userId = 1;
            const solutions = [new Solution(), new Solution()];

            const problem = new Problem();
            problem.difficulty = 'easy';
            problem.id = 1;

            for (const solution of solutions) {
                solution.problem = problem;
            }

            const easies = 1;
            const mediums = 0;
            const hards = 0;
            const total = easies + mediums + hards;

            jest.spyOn(solutionRepo, 'find').mockResolvedValue(solutions);

            const result = await service.getUserStatistics(userId);

            expect(result).toEqual({ easies, mediums, hards, total });
            expect(solutionRepo.find).toHaveBeenCalledWith({ where: { userId }, relations: { problem: true } });
        });

        it('should return empty user statistics if no solutions found', async () => {
            const userId = 1;
            const solutions = [];
            const easies = 0;
            const mediums = 0;
            const hards = 0;
            const total = easies + mediums + hards;
            jest.spyOn(solutionRepo, 'find').mockResolvedValue(solutions);

            const result = await service.getUserStatistics(userId);

            expect(result).toEqual({ easies, mediums, hards, total });
            expect(solutionRepo.find).toHaveBeenCalledWith({ where: { userId }, relations: { problem: true } });
        });
    });
});