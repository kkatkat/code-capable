import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, forwardRef } from "@nestjs/common";
import { ProblemService } from "./problem.service";
import { ProblemInputDTO } from "./problemInput.dto";
import { Problem } from "./problem.entity";
import { ProblemUpdateDTO } from "./problemUpdate.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { Role } from "src/common/roles";
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from "@nestjs/microservices";
import { ServiceFactory } from "../factory/service-factory.service";
import { Like } from "typeorm";

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService, @Inject(forwardRef(() => ServiceFactory)) private readonly sf: ServiceFactory) {}

  @Get('/user/:userId')
  async getForUser(@Param('userId') userId: number): Promise<Problem[]> {
    return this.problemService.find({
        where: {
            creatorId: userId,
        },
        order: {
            createdAt: 'DESC'
        }
    })
  }

  @Get()
  async getAllFiltered(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 20,
    @Query('query') query?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const result = await this.problemService.findAndCount({
        where: {
            approved: true,
            name: query ? Like(`%${query}%`) : undefined,
            difficulty: difficulty ? difficulty : undefined
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        cache: true
    })

    return {
        items: result[0],
        total: result[1],
        totalPages: Math.ceil(result[1] / pageSize),
        currentPage: +page
    }
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    const problem = await this.problemService.findOne({
        where: {
            id,
        },
        relations: {
            unitTests: true
        }
    })

    if (!problem) {
      throw new NotFoundException();
    }

    return problem;
  }

  @Get()
  async getAll() {
    return this.problemService.find();
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() input: ProblemInputDTO, @Req() req: Request): Promise<Problem> {
    const jwtUser = req['user'] as JwtUser;
    input.creatorId = jwtUser.id;

    if (input.unitTests.length === 0) {
        throw new BadRequestException('Problem must have at least one unit test');
    }

    for (const unitTest of input.unitTests) {
        if (unitTest.code.length < 5) {
            throw new BadRequestException('Some of your unit tests are too short, they must be at least 5 characters long');
        }
    }

    return this.problemService.create(input);
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() input: ProblemUpdateDTO, @Req() req: Request): Promise<Problem> {
    const user = req['user'] as JwtUser;

    const problem = await this.problemService.findOne({
      where: {
        id: input.id
      }
    })

    if (problem && user.role !== Role.ADMIN && problem.creatorId !== user.id) {
      throw new ForbiddenException();
    }

    return this.problemService.update(input);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: Request){
    const user = req['user'] as JwtUser;

    const problem = await this.problemService.findOne({
      where: {
        id
      }
    })

    if (problem && problem.creatorId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Attempted to delete another user\'s problem');
    }

    return this.problemService.delete({id});
  }

  @UseGuards(AuthGuard)
  @Post('/approve/:id')
  async approve(@Param('id') id: number, @Req() req: Request) {
    const user = req['user'] as JwtUser;

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const problem = await this.problemService.findOne({
      where: {
        id
      }
    })

    if (!problem) {
      throw new NotFoundException();
    }

    problem.approved = true;

    this.problemService.update(problem);
  }

  @EventPattern('user_deleted')
  async handleUserDeleted(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('user_deleted event received, deleting data related to:', data)

    await this.problemService.delete({ creatorId: data })
    await this.sf.solutionService.delete({ userId: data })

    channel.ack(originalMsg);
  }

  @MessagePattern('get_problem')
  async handleGetProblem(@Payload() data: number, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    const problem = await this.problemService.findOne({
      where: {
        id: data
      },
      relations: {
        unitTests: true
      }
    })

    if (!problem) {
      throw new RpcException('problem not found');
    }

    return problem;
  }

}