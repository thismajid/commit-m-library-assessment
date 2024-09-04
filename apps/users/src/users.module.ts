import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import mainConfig from './configs/main.config';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { BaseRepository } from './repositories/base.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'users', '.env'),
      load: [mainConfig],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BaseRepository, UserRepository],
})
export class UsersModule {}
