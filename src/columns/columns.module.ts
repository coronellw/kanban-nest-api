import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
