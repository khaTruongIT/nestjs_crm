import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { LoggerModule } from './logger/logger.module';
import { logger } from './middleware/logger.middleware';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, LoggerModule, AppModule],
})
export class AppModule implements NestModule {
  // CONFIG LOGGER FOR ALL ROUTES
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes('*');
  }
}