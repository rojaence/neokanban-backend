import './environment/setup-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NeoKanban')
    .setDescription('The API to NeoKanban')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('neokanban')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
