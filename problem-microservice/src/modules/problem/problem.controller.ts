import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, Req, UseGuards, forwardRef } from "@nestjs/common";
import { ProblemService } from "./problem.service";
import { ProblemInputDTO } from "./problemInput.dto";
import { Problem } from "./problem.entity";
import { ProblemUpdateDTO } from "./problemUpdate.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { Role } from "src/common/roles";
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from "@nestjs/microservices";
import { ServiceFactory } from "../factory/service-factory.service";

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

    return this.problemService.create(input);
  }

  @Put()
  async update(@Body() input: ProblemUpdateDTO): Promise<Problem> {
    return this.problemService.update(input);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.problemService.delete({id});
  }

  @Post('/approve/:id')
  async approve(@Param('id') id: number) {
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