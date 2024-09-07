import { Injectable } from '@nestjs/common';
import { BookRepository } from './repositories/book.repository';
import { BorrowingRepository } from './repositories/borrowing.repository';

@Injectable()
export class BooksService {
  constructor(
    private bookRepository: BookRepository,
    private borrowingRepository: BorrowingRepository,
  ) {}

  async addBook(data: {
    title: string;
    author: string;
    category: string;
    userId: number;
  }) {
    return this.bookRepository.create({
      ...data,
      isAvailable: true,
    });
  }

  async listBooks({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      this.bookRepository.findAll({ skip, take: limit }),
      this.bookRepository.count(),
    ]);
    return { books, total };
  }

  async getBook(id: number) {
    return await this.bookRepository.findOne(id);
  }

  async updateBook(data: {
    id: number;
    title: string;
    author: string;
    category: string;
    userId: number;
  }) {
    const hasBook = await this.checkBookIsForUser(data.id, data.userId);

    if (!hasBook) {
      return { success: false, message: 'Book not found by this id' };
    }

    return await this.bookRepository.update(data.id, data);
  }

  async deleteBook(data: { id: number; userId: number }) {
    const hasBook = await this.checkBookIsForUser(data.id, data.userId);

    if (!hasBook) {
      return { success: false, message: 'Book not found by this id' };
    }

    return await this.bookRepository.remove(data.id);
  }

  async searchBooks({
    query,
    page,
    limit,
  }: {
    query: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;
    const dbQuery = {
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
    };

    const [books, total] = await Promise.all([
      this.bookRepository.findAll(dbQuery),
      this.bookRepository.count(dbQuery),
    ]);
    return { books, total };
  }

  async borrowBook(data: { id: number; userId: number }) {
    const book = await this.bookRepository.findOne(data.id);

    if (!book || !book.isAvailable) {
      return { success: false, message: 'Book not available' };
    }

    await this.bookRepository.update(data.id, { isAvailable: false });
    await this.borrowingRepository.create({
      bookId: data.id,
      userId: data.userId,
      borrowDate: new Date(),
    });

    return { success: true, message: 'Book borrowed successfully' };
  }

  async returnBook(data: { id: number; userId: number }) {
    const borrowing = await this.borrowingRepository.findUserBookBorrowing(
      data.id,
      data.userId,
    );

    if (!borrowing) {
      return { success: false, message: 'Book not borrowed by this user' };
    }

    await this.bookRepository.update(data.id, { isAvailable: true });
    await this.borrowingRepository.update(borrowing.id, {
      returnDate: new Date(),
    });

    return { success: true, message: 'Book returned successfully' };
  }

  private async checkBookIsForUser(id, userId) {
    return !!(await this.bookRepository.bookIsForUser(id, userId));
  }
}
