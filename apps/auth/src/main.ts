import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // Access ConfigService
  const configService = app.get(ConfigService);

  // Create the microservice with the generated GRPC options
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, '../../../libs/proto/src/auth.proto'),
        url: configService.get('mainConfig.AUTH_GRPC_URL'),
      },
    });

  await microservice.listen();
  console.log('AUTH microservice is listening...');
}
bootstrap();
