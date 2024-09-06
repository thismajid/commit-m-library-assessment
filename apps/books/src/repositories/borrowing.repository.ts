import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseRepository } from './base.repository';
import { Borrowing } from '../generated/prisma-client-books';

@Injectable()
export class BorrowingRepository extends BaseRepository<Borrowing> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUserBookBorrowing(id, userId) {
    return this.prisma.borrowing.findFirst({
      where: { bookId: id, userId, returnDate: null },
    });
  }
}
