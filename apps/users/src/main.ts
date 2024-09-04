import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  // Access ConfigService
  const configService = app.get(ConfigService);

  // Create the microservice with the generated GRPC options
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, '../../../libs/proto/src/users.proto'),
        url: '0.0.0.0:8002',
      },
    });

  await microservice.listen();
  console.log('Users microservice is listening...');
}
bootstrap();
