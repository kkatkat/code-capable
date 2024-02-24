import { Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
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
    return this.problemService.findOne({
        where: {
            id
        }
    })
  }

  @Post()
  async create(input: ProblemInputDTO): Promise<Problem> {
    return this.problemService.create(input);
  }

  @Put()
  async update(input: ProblemUpdateDTO): Promise<Problem> {
    return this.problemService.update(input);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.problemService.delete({id});
  }

}