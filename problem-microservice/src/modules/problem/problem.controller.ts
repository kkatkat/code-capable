import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Put, Query, Req, UseGuards, forwardRef } from "@nestjs/common";
import { ProblemService } from "./problem.service";
import { ProblemInputDTO } from "./problemInput.dto";
import { Problem } from "./problem.entity";
import { ProblemUpdateDTO } from "./problemUpdate.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { Role } from "src/common/roles";
import { Ctx, MessagePattern, Payload, RmqContext, RpcException } from "@nestjs/microservices";
import { ServiceFactory } from "../factory/service-factory.service";
import { Like } from "typeorm";
import { JwtUserGuard } from "src/common/guards/jwt-user-guard";
import { Paginated } from "src/common/paginated";

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

  @UseGuards(JwtUserGuard)
  @Get()
  async getAllFiltered(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('query') query?: string,
    @Query('difficulty') difficulty?: string,
    @Query('order') order: string = 'desc',
    @Query('creatorId') creatorId?: number
  ): Promise<Paginated<Problem>> {
    const user = req['user'] as JwtUser;

    if (isNaN(page) || page < 1) {
        page = 1;
    }

    if (isNaN(pageSize) || pageSize < 1) {
        pageSize = 20;
    }

    if (order !== 'desc' && order !== 'asc') {
        order = 'desc';
    }

    if (pageSize > 100) {
        pageSize = 100;
    }

    if (pageSize < 1) {
        pageSize = 1;
    }

    const result = await this.problemService.findAndCount({
        where: {
            approved: user && user.role === Role.ADMIN ? undefined : true,
            name: query ? Like(`%${query}%`) : undefined,
            difficulty: difficulty ? difficulty : undefined,
            creatorId: creatorId ? creatorId : undefined
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        order: {
            createdAt: order as 'desc' | 'asc'
        },
        cache: true
    })

    const totalPages = Math.ceil(result[1] / pageSize);
    return {
        items: result[0],
        total: result[1],
        totalPages,
        currentPage: (+page) > totalPages ? totalPages : +page
    }
  }

  @UseGuards(JwtUserGuard)
  @Get('/:id')
  async getById(@Param('id') id: number, @Req() req: Request){
    const user = req['user'] as JwtUser;

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

    if (!problem.approved) {
        if (!user || user.role !== Role.ADMIN) {
            throw new ForbiddenException();
        }
    }

    if (!user || user.role !== Role.ADMIN) {
        problem.unitTests = [...problem.unitTests].filter(ut => ut.visible);
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
    input.creatorName = jwtUser.username;

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

    if (!problem) {
        throw new NotFoundException();
    }

    if (user.role !== Role.ADMIN && problem.creatorId !== user.id) {
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

  @MessagePattern('user_deleted')
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

    const problem = await this.problemService.findOne({
      where: {
        id: data
      },
      relations: {
        unitTests: true
      },
      cache: {
        id: `problem-${data}`,
        milliseconds: 10000
      }
    })

    if (!problem) {
      throw new RpcException('problem not found');
    }

    channel.ack(originalMsg);

    return problem;
  }

}