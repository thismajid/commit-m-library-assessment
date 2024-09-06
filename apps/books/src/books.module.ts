import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BaseRepository } from './repositories/base.repository';
import { BookRepository } from './repositories/book.repository';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import mainConfig from './configs/main.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps', 'books', '.env'),
      load: [mainConfig],
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService, PrismaService, BaseRepository, BookRepository],
})
export class BooksModule {}
