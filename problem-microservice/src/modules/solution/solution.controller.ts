import { Controller, Delete, Get, NotFoundException, Param } from "@nestjs/common";
import { SolutionService } from "./solution.service";
import { Solution } from "./solution.entity";


@Controller('solution')
export class SolutionController {
    constructor(private readonly solutionService: SolutionService) {}

    @Get(':id')
    async getById(@Param('id') id: number): Promise<Solution> {
        const solution = await this.solutionService.findOne({
            where: {
                id
            }
        })

        if (!solution) {
            throw new NotFoundException();
        }

        return solution;
    }

    @Get('/user/:userId/:problemId')
    async getForProblemForUser(@Param('userId') userId: number, @Param('problemId') problemId: number): Promise<Solution[]> {
        const solutions = await this.solutionService.find({
            where: {
                problemId,
                userId,
            },
            order: {
                createdAt: 'DESC',
            }
        })

        return solutions;
    }

    @Get('user/:userId')
    async getForUser(@Param('userId') userId: number) {
        const solutions = await this.solutionService.find({
            where: {
                userId
            },
            order: {
                createdAt: 'DESC'
            }
        })

        return solutions;
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.solutionService.delete({id});
    }
}