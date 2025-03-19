import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';
import { DatabaseModule } from './database/database.module';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [
    UsersModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
    DatabaseModule,
    CustomLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
