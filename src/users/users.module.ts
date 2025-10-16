import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@/database/database.module';
import { CustomLoggerModule } from '@/custom-logger/custom-logger.module';

@Module({
  imports: [DatabaseModule, CustomLoggerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
