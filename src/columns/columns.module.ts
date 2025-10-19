import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
