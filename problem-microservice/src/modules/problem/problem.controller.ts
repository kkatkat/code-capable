import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { ProblemService } from "./problem.service";
import { ProblemInputDTO } from "./problemInput.dto";
import { Problem } from "./problem.entity";
import { ProblemUpdateDTO } from "./problemUpdate.dto";

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get('/user/:userId')
  async getForUser(@Param('userId') userId: number): Promise<Problem[]> {
    return this.problemService.find({
        where: {
            creatorId: userId
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
            id
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

  @Post()
  async create(@Body() input: ProblemInputDTO): Promise<Problem> {
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

}