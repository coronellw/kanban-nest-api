import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({ data: createUserDto })
  }

  async findAll() {
    return this.databaseService.user.findMany({})
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
}
