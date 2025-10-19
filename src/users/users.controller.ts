import { Controller, Get, Post, Body, Patch, Param, Delete, Ip, HttpCode, HttpStatus, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  logout(@Request() req) {

    if(!req.user || !req.user.id || !req.user.token) {
      throw new UnauthorizedException();
    }

    return this.usersService.logout(req.user.id, req.user.token);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Ip() ip: string) {
    this.logger.log(`Request for all employees\t${ip}`)
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
