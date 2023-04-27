import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;
  app.use(logger);
  await app.listen(port);
}
bootstrap();
