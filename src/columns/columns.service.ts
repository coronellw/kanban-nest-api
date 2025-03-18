import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ColumnsService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createColumnDto: Prisma.ColumnCreateInput) {
    return this.databaseService.column.create({ data: createColumnDto })
  }

  findAll() {
    return this.databaseService.column.findMany({})
  }

  findOne(id: number) {
    return this.databaseService.column.findFirst({ where: { id } })
  }

  update(id: number, updateColumnDto: Prisma.ColumnUpdateInput) {
    return this.databaseService.column.update({
      where: { id },
      data: updateColumnDto
    })
  }

  remove(id: number) {
    return this.databaseService.column.delete({ where: { id } })
  }
}
