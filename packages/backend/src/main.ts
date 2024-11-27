import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './note/common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsAdapter } from '@nestjs/platform-ws';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');
  configureGlobalSettings(app);
  configureSwagger(app);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  logger.log(`Honeyflow started on port ${PORT}`);
}

function configureGlobalSettings(app: any) {
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: [
      'http://www.honeyflow.life',
      'https://www.honeyflow.life',
      'http://localhost',
      'http://localhost:5173',
    ],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}

function configureSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API 설명')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

bootstrap();
