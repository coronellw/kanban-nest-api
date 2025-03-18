import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Prisma } from '@prisma/client';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body() createBoardDto: Prisma.BoardCreateInput) {
    return this.boardsService.create(createBoardDto);
  }

  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: Prisma.BoardUpdateInput) {
    return this.boardsService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }
}
