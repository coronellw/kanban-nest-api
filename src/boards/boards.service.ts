import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';
import { addIdAlias, addIdAliasToArray } from '@/helpers/add-id-alias/add-id-alias';

@Injectable()
export class BoardsService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createBoardDto: Prisma.BoardCreateInput) {
    const newBoard = await this.databaseService.board.create({ 
      data: createBoardDto,
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
    });
    return addIdAlias(newBoard);
  }

  async findAll() {
    const boards = await this.databaseService.board.findMany({
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
    });
    return addIdAliasToArray(boards);
  }

  async findOne(id: number) {
    const board = await this.databaseService.board.findFirst({
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
    });
    return board ? addIdAlias(board) : null;
  }

  async update(id: number, updateBoardDto: Prisma.BoardUpdateInput) {
    const board = await this.databaseService.board.update({
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
    });
    return addIdAlias(board);
  }

  async remove(id: number) {
    const board = await this.databaseService.board.delete({ where: { id } });
    return addIdAlias(board);
  }
}
