import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@/database/database.service';
import { CustomLoggerService } from '@/custom-logger/custom-logger.service';
import { addIdAlias, addIdAliasToArray } from '@/helpers/add-id-alias/add-id-alias';

@Injectable()
export class ColumnsService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new CustomLoggerService(ColumnsService.name);

  async create(createColumnDto: Prisma.ColumnCreateInput) {
    const column = await this.databaseService.column.create({ data: createColumnDto })
    return addIdAlias(column)
  }

  async findAll() {
    const columns = await this.databaseService.column.findMany({})
    return addIdAliasToArray(columns)
  }

  async findOne(id: number) {
    const column = await this.databaseService.column.findFirst({ where: { id } })
    return column ? addIdAlias(column) : null
  }

  async update(id: number, updateColumnDto: Prisma.ColumnUpdateInput) {
    const updatedColumn = await this.databaseService.column.update({
      where: { id },
      data: updateColumnDto
    })

    return addIdAlias(updatedColumn)
  }

  async remove(id: number) {
    const deletedColumn = await this.databaseService.column.delete({ where: { id } })
    return addIdAlias(deletedColumn)
  }
}
