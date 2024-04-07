import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UnitTestService } from './unit-test.service';
import { UnitTest } from './unit-test.entity';
import { ServiceFactory } from '../factory/service-factory.service';
import { Problem } from '../problem/problem.entity';
import { UnitTestInputDTO } from './unit-testIput.dto';
import { UnitTestUpdateDTO } from './unit-testUpdate.dto';

describe('UnitTestService', () => {
  let service: UnitTestService;
  let unitTestRepo: Repository<UnitTest>;
  let sf: ServiceFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitTestService,
        {
          provide: getRepositoryToken(UnitTest),
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

    service = module.get<UnitTestService>(UnitTestService);
    unitTestRepo = module.get<Repository<UnitTest>>(getRepositoryToken(UnitTest));
    sf = module.get<ServiceFactory>(ServiceFactory);
  });

  describe('findOne', () => {
    it('should return a unit test', async () => {
      const options = { where: { id: 1 } };
      const unitTest = new UnitTest();
      jest.spyOn(unitTestRepo, 'findOne').mockResolvedValue(unitTest);

      const result = await service.findOne(options);

      expect(result).toBe(unitTest);
      expect(unitTestRepo.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('find', () => {
    it('should return an array of unit tests', async () => {
      const options = {};
      const unitTests = [new UnitTest(), new UnitTest()];
      jest.spyOn(unitTestRepo, 'find').mockResolvedValue(unitTests);

      const result = await service.find(options);

      expect(result).toBe(unitTests);
      expect(unitTestRepo.find).toHaveBeenCalledWith(options);
    });
  });

  describe('count', () => {
    it('should return the count of unit tests', async () => {
      const options = {};
      const count = 5;
      jest.spyOn(unitTestRepo, 'count').mockResolvedValue(count);

      const result = await service.count(options);

      expect(result).toBe(count);
      expect(unitTestRepo.count).toHaveBeenCalledWith(options);
    });
  });

  describe('create', () => {
    it('should create a unit test', async () => {
      const unitTestData: UnitTestInputDTO = { problemId: 1, code: 'console.log("Hello, World!")' };
      const problem = new Problem();
      const unitTest = new UnitTest();
      jest.spyOn(sf.problemService, 'findOne').mockResolvedValue(problem);
      jest.spyOn(unitTestRepo, 'create').mockReturnValue(unitTest);
      jest.spyOn(unitTestRepo, 'save').mockResolvedValue(unitTest);

      const result = await service.create(unitTestData);

      expect(result).toBe(unitTest);
      expect(sf.problemService.findOne).toHaveBeenCalledWith({ where: { id: unitTestData.problemId } });
      expect(unitTestRepo.create).toHaveBeenCalledWith(unitTestData);
      expect(unitTestRepo.save).toHaveBeenCalledWith(unitTest);
    });

    it('should throw NotFoundException if problem not found', async () => {
      const unitTestData: UnitTestInputDTO = { problemId: 1, code: 'console.log("Hello, World!")' };
      jest.spyOn(sf.problemService, 'findOne').mockResolvedValue(null);
      jest.spyOn(unitTestRepo, 'create').mockReturnValue(unitTestData as UnitTest);

      try {
        await service.create(unitTestData);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('relationship.notFound.problem');
      }

      expect(sf.problemService.findOne).toHaveBeenCalledWith({ where: { id: unitTestData.problemId } });
    });
  });

  describe('update', () => {
    it('should update a unit test', async () => {
      const unitTestData: UnitTestUpdateDTO = { id: 1, code: 'console.log("Updated!")' };
      const existingUnitTest = new UnitTest();
      jest.spyOn(service, 'findOne').mockResolvedValue(existingUnitTest);
      jest.spyOn(unitTestRepo, 'save').mockResolvedValue(unitTestData as UnitTest);

      const result = await service.update(unitTestData);

      expect(result).toBe(unitTestData);
      expect(service.findOne).toHaveBeenCalledWith({ where: { id: unitTestData.id } });
      expect(unitTestRepo.save).toHaveBeenCalledWith(unitTestData);
    });

    it('should throw NotFoundException if unit test not found', async () => {
      const unitTestData: UnitTestUpdateDTO = { id: 1, code: 'console.log("Updated!")' };
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      try {
        await service.update(unitTestData);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(service.findOne).toHaveBeenCalledWith({ where: { id: unitTestData.id } });
    });
  });

  describe('delete', () => {
    it('should delete unit tests', async () => {
      const options = { id: 1 };
      jest.spyOn(unitTestRepo, 'delete').mockResolvedValue(Promise.resolve({ affected: 1, raw: undefined }));

      const result = await service.delete(options);

      expect(result).toEqual({ affected: 1 });
      expect(unitTestRepo.delete).toHaveBeenCalledWith(options);
    });
  });
});