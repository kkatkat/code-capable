import { Body, Controller, Delete, Get, ImATeapotException, NotFoundException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ProblemService } from "./problem.service";
import { ProblemInputDTO } from "./problemInput.dto";
import { Problem } from "./problem.entity";
import { ProblemUpdateDTO } from "./problemUpdate.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { Role } from "src/common/roles";

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

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

}