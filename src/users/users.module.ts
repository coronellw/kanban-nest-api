import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@/database/database.module';
import { CustomLoggerModule } from '@/custom-logger/custom-logger.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    DatabaseModule, 
    CustomLoggerModule,
    forwardRef(() => AuthModule), // Use forwardRef to handle circular dependency
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
