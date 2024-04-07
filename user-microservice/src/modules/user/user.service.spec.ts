import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { ServiceFactory } from '../factory/service-factory.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserCreateDTO } from './user-create.dto';
import { UserUpdateDTO } from './user-update.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let serviceFactory: ServiceFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
            provide: ServiceFactory,
            useValue: {
                userService: {
                    findOneFull: jest.fn(),
                    create: jest.fn(),
                    findOne: jest.fn(),
                },
            },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    serviceFactory = module.get<ServiceFactory>(ServiceFactory);
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const options = { where: { id: 1 } };
      const user = { id: 1, username: 'testuser' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);

      const result = await userService.findOne(options);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('findOneFull', () => {
    it('should return a user with full details', async () => {
      const options = { where: { id: 1 } };
      const user = { id: 1, username: 'testuser' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);

      const result = await userService.findOneFull(options);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        ...options,
        select: expect.any(Object),
      });
    });
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      const options = {};

      const users = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users as any[]);

      const result = await userService.find(options);

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledWith(options);
    });
  });

  describe('count', () => {
    it('should return the count of users', async () => {
      const options = {};
      const count = 10;

      jest.spyOn(userRepository, 'count').mockResolvedValue(count);

      const result = await userService.count(options);

      expect(result).toEqual(count);
      expect(userRepository.count).toHaveBeenCalledWith(options);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData: UserCreateDTO = {
        username: 'testuser',
        password: 'testpassword',
        acceptedTermsAndConditions: true,
        email: 'testuser@example.com',
      };

      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'testpassword',
        acceptedTermsAndConditions: true,
        email: 'testuser@example.com',
        role: 'user',
        createdAt: new Date(),
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await userService.create(userData);

      expect(result).toEqual(user);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw a ConflictException if username or email is already taken', async () => {
      const userData: UserCreateDTO = {
        username: 'testuser',
        password: 'testpassword',
        acceptedTermsAndConditions: true,
        email: 'testuser@example.com',
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(userData as any);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('', [], new Error())
      });

      await expect(userService.create(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userData: UserUpdateDTO = {
        id: 1,
        bio: 'blablabla',
        linkedInUsername: 'testuser'
      };

      const foundUser = { id: 1, username: 'testuser' };
      const updatedUser = { ...userData };

      jest.spyOn(userService, 'findOne').mockResolvedValue(foundUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as any);

      const result = await userService.update(userData);

      expect(result).toEqual(updatedUser);
      expect(userService.findOne).toHaveBeenCalledWith({ where: { id: userData.id } });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      const userData: UserUpdateDTO = {
        id: 1,
        bio: 'blablabla',
        linkedInUsername: 'testuser'
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(userService.update(userData)).rejects.toThrow(NotFoundException);
      expect(userService.findOne).toHaveBeenCalledWith({ where: { id: userData.id } });
    });

    it('should throw a ConflictException if email or username is already taken', async () => {
      const userData: UserUpdateDTO = {
        id: 1,
        bio: 'testuser@example.com',
      };

      const foundUser = { id: 1, username: 'testuser' };

      jest.spyOn(userService, 'findOne').mockResolvedValue(foundUser as any);
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('', [], new Error())
      });

      await expect(userService.update(userData)).rejects.toThrow(ConflictException);
      expect(userService.findOne).toHaveBeenCalledWith({ where: { id: userData.id } });
    });
  });

  describe('delete', () => {
    it('should delete users based on options', async () => {
      const options = { id: 1 }

      jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      const result = await userService.delete(options);

      expect(result).toEqual({ affected: 1, raw: {} });
      expect(userRepository.delete).toHaveBeenCalledWith(options);
    });
  });
});