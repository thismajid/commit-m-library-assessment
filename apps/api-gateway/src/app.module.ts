import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mainConfig from './configs/main.config';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { BookController } from './book.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'api-gateway', '.env'),
      load: [mainConfig],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('mainConfig.JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(
            'mainConfig.JWT_EXPIRATION',
            '1d',
          ),
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(__dirname, '../../../libs/proto/src/auth.proto'),
            url: configService.get<string>('mainConfig.AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'USER_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'users',
            protoPath: join(__dirname, '../../../libs/proto/src/users.proto'),
            url: configService.get<string>('mainConfig.USERS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'BOOK_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'books',
            protoPath: join(__dirname, '../../../libs/proto/src/books.proto'),
            url: configService.get<string>('mainConfig.BOOKS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController, UserController, BookController],
})
export class AppModule {}
