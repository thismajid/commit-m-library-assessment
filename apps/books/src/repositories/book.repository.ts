import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Book } from '@prisma/client';
import { BaseRepository } from './base.repository';

@Injectable()
export class BookRepository extends BaseRepository<Book> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async bookIsForUser(id: number, userId: number): Promise<Book | null> {
    return this.prisma.book.findUnique({ where: { id, userId } });
  }
}
