import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ServiceFactory } from '../factory/service-factory.service';
import { UnauthorizedException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserCreateDTO } from '../user/user-create.dto';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { LoginRequest } from './login-request.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtUser } from 'src/common/jwt-user';

describe('AuthService', () => {
  let authService: AuthService;
  let serviceFactory: ServiceFactory;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    serviceFactory = module.get<ServiceFactory>(ServiceFactory);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('login', () => {
    it('should return user and access token if login is successful', async () => {
      const body: LoginRequest = {
        username: 'testuser',
        password: 'testpassword',
      };

      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        role: 'user',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
      };
      const token = 'testtoken';

      jest.spyOn(serviceFactory.userService, 'findOneFull').mockResolvedValue(user);
      jest.spyOn(authService, 'signJwt').mockReturnValue(token);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const result = await authService.login(body);

      expect(result.user).toEqual(user);
      expect(result.accessToken).toEqual(token);
      expect(serviceFactory.userService.findOneFull).toHaveBeenCalledWith({ where: { username: body.username } });
      expect(authService.signJwt).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const body: LoginRequest = {
        username: 'testuser',
        password: 'testpassword',
      };

      jest.spyOn(serviceFactory.userService, 'findOneFull').mockResolvedValue(null);

      await expect(authService.login(body)).rejects.toThrow(UnauthorizedException);
      expect(serviceFactory.userService.findOneFull).toHaveBeenCalledWith({ where: { username: body.username } });
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const body: LoginRequest = {
        username: 'testuser',
        password: 'testpassword',
      };
      const user: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
        password: 'hashedpassword',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
      };

      jest.spyOn(serviceFactory.userService, 'findOneFull').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(authService.login(body)).rejects.toThrow(UnauthorizedException);
      expect(serviceFactory.userService.findOneFull).toHaveBeenCalledWith({ where: { username: body.username } });
      expect(bcrypt.compare).toHaveBeenCalledWith(body.password, user.password);
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
        const body: UserCreateDTO = {
            username: 'testuser',
            password: 'testpassword',
            acceptedTermsAndConditions: true,
            email: 'john.doe@example.com',
        };

        jest.spyOn(serviceFactory.userService, 'create').mockResolvedValue(body as User);

        await authService.register(body);

        expect(serviceFactory.userService.create).toHaveBeenCalledWith(body);
    });

    it('should throw ForbiddenException if terms and conditions are not accepted', async () => {
        const body: UserCreateDTO = {
            username: 'testuser',
            password: 'testpassword',
            acceptedTermsAndConditions: false,
            email: 'john.doe@example.com',
        };

      await expect(authService.register(body)).rejects.toThrow(ForbiddenException);
      expect(serviceFactory.userService.create).not.toHaveBeenCalled();
    });
  });

  describe('signJwt', () => {
    it('should return a signed JWT token', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
      };
      const privateKey = 'testprivatekey';
      const token = 'testtoken';

      jest.spyOn(configService, 'get').mockReturnValue(privateKey);
      jest.spyOn(jwt, 'sign').mockImplementation(() => token);

      const result = authService.signJwt(user);

      expect(result).toEqual(token);
      expect(configService.get).toHaveBeenCalledWith('jwtPrivateKey');
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
          // ... other user properties
        }),
        privateKey,
        expect.any(Object)
      );
    });

    it('should throw InternalServerErrorException if JWT private key is invalid', () => {
      const user: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
      };

      jest.spyOn(configService, 'get').mockReturnValue(null);

      expect(() => authService.signJwt(user)).toThrow(InternalServerErrorException);
      expect(configService.get).toHaveBeenCalledWith('jwtPrivateKey');
    });
  });

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const rawPassword = 'testpassword';
      const hashedPassword = 'hashedpassword';

      jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);

      const result = await authService.hashPassword(rawPassword);

      expect(result).toEqual(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(rawPassword, 10);
    });
  });

  describe('checkToken', () => {
    it('should return user if user exists', async () => {
      const jwtUser: JwtUser = {
        id: 1,
        username: 'testuser',
        role: 'user',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
        accountConfirmed: true,
      };
      const user: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
      };

      jest.spyOn(serviceFactory.userService, 'findOne').mockResolvedValue(user);

      const result = await authService.checkToken(jwtUser);

      expect(result.user).toEqual(user);
      expect(serviceFactory.userService.findOne).toHaveBeenCalledWith({ where: { id: jwtUser.id } });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const jwtUser = {
        id: 1,
        username: 'testuser',
        role: 'user',
        email: 'testuser@example.com',
        acceptedTermsAndConditions: true,
        createdAt: new Date(),
        accountConfirmed: true,
      };

      jest.spyOn(serviceFactory.userService, 'findOne').mockResolvedValue(null);

      await expect(authService.checkToken(jwtUser)).rejects.toThrow(NotFoundException);
      expect(serviceFactory.userService.findOne).toHaveBeenCalledWith({ where: { id: jwtUser.id } });
    });
  });
});