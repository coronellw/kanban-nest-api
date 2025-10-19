import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ColumnsService } from './columns.service';
import { AuthGuard } from '@/auth/auth.guard';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }
  private readonly logger = new CustomLoggerService(ColumnsController.name);

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createColumnDto: Prisma.ColumnCreateInput, @Request() req) {
    createColumnDto.board = {
      connect: {
        id: createColumnDto.board as number
      }
    }
    return this.columnsService.create(createColumnDto);
  }

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: Prisma.ColumnUpdateInput) {
    return this.columnsService.update(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(+id);
  }
}
