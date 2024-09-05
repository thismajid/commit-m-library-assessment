import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import mainConfig from './configs/main.config';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { BaseRepository } from './repositories/base.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'users', '.env'),
      load: [mainConfig],
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
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BaseRepository, UserRepository],
})
export class UsersModule {}
