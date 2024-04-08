import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, userFields } from "./user.entity";
import { FindManyOptions, FindOneOptions, FindOptionsSelect, FindOptionsWhere, QueryFailedError, Repository } from "typeorm";
import { ServiceFactory } from "../factory/service-factory.service";
import { UserCreateDTO } from "./user-create.dto";
import { UserUpdateDTO } from "./user-update.dto";
import { randomString } from "src/common/lib";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        protected readonly userRepo: Repository<User>,

        @Inject(forwardRef(() => ServiceFactory))
        protected readonly sf: ServiceFactory,
    ) {}

    async findOne(options: FindOneOptions<User>): Promise<User> {
        return await this.userRepo.findOne(options);
    }

    async findOneFull(options: FindOneOptions<User>): Promise<User> {
        const select: FindOptionsSelect<User> = Object.fromEntries(
            userFields.map((key) => [key, true])
          );

        return this.userRepo.findOne({
            ...options,
            select: {...options.select, ...select}
        })
    }

    async find(options?: FindManyOptions<User>): Promise<User[]> {
        return this.userRepo.find(options);
    }

    async count(options?: FindManyOptions<User>) {
        return this.userRepo.count(options);
    }

    async create(userData: Partial<User> & UserCreateDTO): Promise<User> {
        const user: User = this.userRepo.create({
            ...userData
        });

        if (!user.role) {
            user.role = 'user'
        }

        if (!user.provider) {
            user.confirmationCode = randomString(24);
        }

        try {
            return await this.userRepo.save(user)
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new ConflictException("Username or email already taken");
            } else {
                throw error
            }
        }
    }

    async update(userData: Partial<User> & UserUpdateDTO): Promise<User> {
        const foundUser = await this.findOneFull({
            where: {
                id: userData.id,
            }
        });

        if (!foundUser) {
            throw new NotFoundException();
        }

        const user: Partial<User> = userData;

        if (userData.password) {
            if (userData.password.length < 9) {
                throw new BadRequestException('Please choose a stronger password');
            }

            if (!userData.oldPassword) {
                throw new BadRequestException('Please write your current password');
            }
            
            if (!bcrypt.compare(userData.password, foundUser.password)) {
                throw new ForbiddenException('Wrong current password');
            }

            user.password = await this.sf.authService.hashPassword(userData.password);
        }

        try {
            const savedUser = await this.userRepo.save(user);
            delete savedUser.password
            return savedUser;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new ConflictException('Email or username already taken');
            } else {
                throw error;
            }
        }
    }

    async delete(options: FindOptionsWhere<User>) {
        return this.userRepo.delete(options);
    }


}