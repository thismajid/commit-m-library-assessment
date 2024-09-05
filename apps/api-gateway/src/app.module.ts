import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mainConfig from './configs/main.config';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
      envFilePath: join(process.cwd(), 'apps', 'api-gateway', '.env'),
      load: [mainConfig],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Replace with your JWT secret key
      signOptions: { expiresIn: '3600s' }, // Token expiration time
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(__dirname, '../../../libs/proto/src/auth.proto'),
            url: '0.0.0.0:8001',
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(__dirname, '../../../libs/proto/src/users.proto'),
            url: '0.0.0.0:8002',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController, UserController],
})
export class AppModule {}
