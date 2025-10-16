import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async signIn(email: string, password: string): Promise<{ token: string }> {
        const user = await this.usersService.findByEmail(email)
        if (user?.password !== password) {
            throw new UnauthorizedException()
        }

        const { password: _password, ...result } = user;
        return { ...result, token: this.jwtService.sign(result) }
    }
}
