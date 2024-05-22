// import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
// import { UnitTestService } from "./unit-test.service";
// import { UnitTest } from "./unit-test.entity";
// import { UnitTestInputDTO } from "./unit-testIput.dto";
// import { UnitTestUpdateDTO } from "./unit-testUpdate.dto";

// @Controller('unit-test')
// export class UnitTestController {
//     constructor(private readonly unitTestService: UnitTestService) {}

//     @Get('/problem/:problemId')
//     async getForProblem(@Param('problemId') problemId: number): Promise<UnitTest[]> {
//         return this.unitTestService.find({
//             where: {
//                 problem: {
//                     id: problemId
//                 }
//             }
//         })
//     }

//     @Get('/:id')
//     async getById(@Param('id') id: number) {
//         const unitTest = await this.unitTestService.findOne({
//             where: {
//                 id
//             }
//         })

//         if (!unitTest) {
//             throw new NotFoundException();
//         }

//         return unitTest;
//     }

//     @Post()
//     async create(@Body() input: UnitTestInputDTO): Promise<UnitTest> {
//         return this.unitTestService.create(input);
//     }

//     @Put()
//     async update(@Body() input: UnitTestUpdateDTO): Promise<UnitTest> {
//         return this.unitTestService.update(input);
//     }

//     @Delete(':id')
//     async delete(@Param('id') id: number) {
//         return this.unitTestService.delete({id});
//     }
// }