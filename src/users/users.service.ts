import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }

  private readonly logger = new CustomLoggerService(UsersService.name);

  async create(createUserDto: Prisma.UserCreateInput) {
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    
    // Create user with hashed password
    const userData = { ...createUserDto, password: hashedPassword };
    return this.databaseService.user.create({ data: userData });
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
    // If password is being updated, hash it
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password as string, saltRounds);
    }
    
    return this.databaseService.user.update({ data: updateUserDto, where: { id } });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({ where: { id } })
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    
    
    return this.authService.signIn(email, password);
  }


  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

}
