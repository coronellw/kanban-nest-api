import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({ data: createUserDto })
  }

  async findAll() {
    return this.databaseService.user.findMany({
      include: {
        boards: true,
        tasks: true,
      },
      omit: {
        dateOfBirth: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  async findOne(id: number) {
    return this.databaseService.user.findFirst({
      where: { id }
    })
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({ data: updateUserDto, where: { id } })
  }

  async remove(id: number) {
    return this.databaseService.user.delete({ where: { id } })
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    
    // Find user by email
    const user = await this.databaseService.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // For now, comparing plain text passwords
    // In production, you should hash passwords and compare hashes
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
