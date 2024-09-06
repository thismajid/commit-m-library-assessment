import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { BooksModule } from './books.module';

async function bootstrap() {
  const app = await NestFactory.create(BooksModule);

  // Access ConfigService
  const configService = app.get(ConfigService);

  // Create the microservice with the generated GRPC options
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(BooksModule, {
      transport: Transport.GRPC,
      options: {
        package: 'books',
        protoPath: join(__dirname, '../../../libs/proto/src/books.proto'),
        url: configService.get<string>('mainConfig.BOOKS_GRPC_URL'),
      },
    });

  await microservice.listen();
  console.log('Books microservice is listening...');
}
bootstrap();
