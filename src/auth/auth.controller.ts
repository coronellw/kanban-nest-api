import { Controller, Body, Post, HttpCode, HttpStatus, Request, UseGuards, Get, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signUp(@Body() user: Prisma.UserCreateInput) {
        return this.authService.signUp(user)
    }

    @UseGuards(AuthGuard)
    @Get('settings')
    getProfile(@Request() req) {
        return req.user
    }

    @UseGuards(AuthGuard)
    @Delete('logout')
    logOut(@Request() req) {
        this.authService.deleteToken(req.user.id, req.user.token)
    }
}
