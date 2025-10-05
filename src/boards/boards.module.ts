import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
