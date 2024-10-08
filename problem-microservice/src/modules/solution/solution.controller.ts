import { Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Query, Req, UseGuards } from "@nestjs/common";
import { SolutionService } from "./solution.service";
import { Solution } from "./solution.entity";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { Role } from "src/common/roles";
import { Paginated } from "src/common/paginated";


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

    @Get('/problem/:problemId')
    async getForProblem(@Param('problemId') problemId: number,  @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 20): Promise<Paginated<Solution>> {
        if (pageSize > 100) {
            pageSize = 100;
        }

        if (pageSize < 1) {
            pageSize = 1;
        }

        const solutions = await this.solutionService.findAndCount({
            where: {
                problemId
            },
            order: {
                createdAt: 'DESC',
            },
            take: pageSize,
            skip: (page - 1) * pageSize
        })

        return {
            items: solutions[0],
            total: solutions[1],
            currentPage: page,
            totalPages: Math.ceil(solutions[1] / pageSize)
        }
    }

    @Get('user/:userId')
    async getForUser(@Param('userId') userId: number, @Query('page') page: number = 1, @Query('pageSize') pageSize: number = 20): Promise<Paginated<Solution>> {
        if (pageSize > 100) {
            pageSize = 100;
        }

        if (pageSize < 1) {
            pageSize = 1;
        }
        
        const solutions = await this.solutionService.findAndCount({
            where: {
                userId
            },
            relations: {
                problem: true
            },
            order: {
                createdAt: 'DESC'
            },
            take: pageSize,
            skip: (page - 1) * pageSize
        })

        return {
            items: solutions[0],
            total: solutions[1],
            currentPage: page,
            totalPages: Math.ceil(solutions[1] / pageSize)
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @Req() req: Request) {
        const user = req['user'] as JwtUser;

        const solution = await this.solutionService.findOne({
            where: {
                id
            }
        })

        if (!solution) throw new NotFoundException();

        if (solution.userId !== user.id && user.role !== Role.ADMIN) {
            throw new ForbiddenException();
        }

        return await this.solutionService.delete({id});
    }

    @Get('/statistics/user/:userId')
    async getUserStatistics(@Param('userId') userId: number) {
        return this.solutionService.getUserStatistics(userId);
    }

    @MessagePattern('solution_submitted')
    async handleSolutionSubmitted(@Payload() submission: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originamMsg = context.getMessage();
        console.log('solution_submitted event received, adding submission to db')

        await this.solutionService.create(submission);

        channel.ack(originamMsg);
    }

}