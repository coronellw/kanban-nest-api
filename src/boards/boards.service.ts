import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BoardsService {

  constructor(private readonly databaseService: DatabaseService) { }

  create(createBoardDto: Prisma.BoardCreateInput) {
    return this.databaseService.board.create({ data: createBoardDto })
  }

  findAll() {
    return this.databaseService.board.findMany({
      select: {
        id: true,
        name: true,
        columns: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      }
    })
  }

  findOne(id: number) {
    return this.databaseService.board.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        columns: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      }
    })
  }

  update(id: number, updateBoardDto: Prisma.BoardUpdateInput) {
    return this.databaseService.board.update({
      where: { id },
      data: updateBoardDto,
      select: {
        id: true,
        name: true,
        columns: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
      }
    })
  }

  remove(id: number) {
    return this.databaseService.board.delete({ where: { id } })
  }
}
