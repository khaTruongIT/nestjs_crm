import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;

  //SET UP PIPE TO VALIDATE INPUT DATA 
  app.useGlobalPipes(new ValidationPipe())

  // const config = new DocumentBuilder()
  //   .setTitle('CRM')
  //   .setDescription('Crm API description')
  //   .setVersion('1.0')
  //   .addTag('crm')
  //   .addBearerAuth()
  //   .build();

  // build document
  // const document = SwaggerModule.createDocument(app, config);

  // SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
