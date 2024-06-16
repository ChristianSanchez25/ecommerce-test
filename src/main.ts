import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  AllExceptionFilter,
  LoggerAdapter,
  LoggingInterceptor,
} from './common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('API-Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'docs', method: RequestMethod.GET }],
  });
  const config = new DocumentBuilder()
    .setTitle('ECommerce API')
    .setDescription('API for ECommerce application')
    .setVersion(envs.version || '1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter(new LoggerAdapter()));
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerAdapter()));
  app.enableCors();
  await app.listen(envs.port);
  logger.log(`API running on port ${envs.port}`);
}
bootstrap();
