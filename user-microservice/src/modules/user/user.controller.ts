import { Body, Controller, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserCreateDTO } from "./user-create.dto";
import { UserUpdateDTO } from "./user-update.dto";


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

    @Post()
    async createUser(@Body() body: UserCreateDTO) {
        this.userService.create(body);
    }

    @Put()
    async updateUser(@Body() body: UserUpdateDTO) {
        this.userService.update(body);
    }
}