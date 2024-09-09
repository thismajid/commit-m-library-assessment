import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseWrapperInterceptor } from '@app/interceptors/ResponseWrapper.interceptor';
import { AllExceptionsFilter } from '@app/filters/AllExceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);

  const globalPrefix = configService.get<string>('GLOBAL_PREFIX', 'api');

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Library System API')
    .setDescription('The Library System API description')
    .setVersion('1.0')
    .addTag('library')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  const appHost = configService.get<string>('APP_HOST');
  const appPort = configService.get<number>('APP_PORT', 3000);

  await app.listen(appPort, () => {
    console.log(`Server is running on: http://${appHost}:${appPort}`);
    console.log(`Swagger is accessible on: http://${appHost}:${appPort}/docs`);
  });
}
bootstrap();
