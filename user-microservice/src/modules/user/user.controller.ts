import { Body, Controller, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserUpdateDTO } from "./user-update.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { JwtUser } from "src/common/jwt-user";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard)
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

    @Put()
    async updateUser(@Body() body: UserUpdateDTO) {
        this.userService.update(body);
    }
}