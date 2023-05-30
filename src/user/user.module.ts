import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  imports: [LoggerModule]
})
export class UserModule {}
