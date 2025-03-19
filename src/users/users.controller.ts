import { Controller, Ip, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersService } from './users.service';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }
  private readonly logger = new CustomLoggerService(UsersController.name)

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Ip() ip: string) {
    this.logger.log(`Request for all employees\t${ip}`)
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
