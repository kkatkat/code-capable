import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserUpdateDTO } from "./user-update.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";
import { Response } from "express";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUser(@Param('id') id: number) {
        const user = await this.userService.findOne({
            where: {
                id
            }
        })

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    @UseGuards(AuthGuard)
    @Put()
    async updateUser(@Body() body: UserUpdateDTO, @Req() req: Request) {
        const user = req['user'] as JwtUser;

        if (user.id !== body.id) {
            throw new ForbiddenException();
        }
        
        return this.userService.update(body);
    }

    @Get('/health')
    async health(@Res() res: Response) {
        res.status(HttpStatus.OK)
    }
}