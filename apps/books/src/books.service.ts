import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookRepository } from './repositories/book.repository';
import { BorrowingRepository } from './repositories/borrowing.repository';
import { Book } from './generated/prisma-client-books';
import { ServiceResponse } from '@app/interfaces/response.interface';

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
  }): Promise<Book> {
    const newBook = await this.bookRepository.create({
      ...data,
      isAvailable: true,
    });

    return newBook;
  }

  async listBooks({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      this.bookRepository.findAll({ skip, take: limit }),
      this.bookRepository.count(),
    ]);
    return { books, total: +total };
  }

  async getBook(id: number): Promise<Book> {
    return await this.bookRepository.findOne(id);
  }

  async updateBook(data: {
    id: number;
    title: string;
    author: string;
    category: string;
  }): Promise<Book> {
    const bookFound = await this.getBook(data.id);

    if (!bookFound) {
      throw new NotFoundException('Book not found by this id');
    }

    return await this.bookRepository.update(data.id, data);
  }

  async deleteBook(data: { id: number }): Promise<void> {
    const bookFound = await this.getBook(data.id);

    if (!bookFound) {
      throw new NotFoundException('Book not found by this id');
    }

    await this.bookRepository.remove(data.id);
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
      skip,
      take: limit,
      ...(query
        ? {
            where: {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { author: { contains: query, mode: 'insensitive' } },
                { category: { contains: query, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const [books, total] = await Promise.all([
      this.bookRepository.findAll(dbQuery),
      this.bookRepository.count(dbQuery),
    ]);

    return { books, total: +total };
  }

  async borrowBook(data: { id: number; userId: number }): Promise<void> {
    const book = await this.bookRepository.findOne(data.id);

    if (!book || !book.isAvailable) {
      throw new BadRequestException('Book not available');
    }

    await this.bookRepository.update(data.id, { isAvailable: false });
    await this.borrowingRepository.create({
      bookId: data.id,
      userId: data.userId,
      borrowDate: new Date(),
    });
  }

  async returnBook(data: { id: number; userId: number }): Promise<void> {
    const borrowing = await this.borrowingRepository.findUserBookBorrowing(
      data.id,
      data.userId,
    );

    if (!borrowing) {
      throw new BadRequestException('Book not borrowed by this user');
    }

    await this.bookRepository.update(data.id, { isAvailable: true });
    await this.borrowingRepository.update(borrowing.id, {
      returnDate: new Date(),
    });
  }

  private async checkBookIsForUser(id, userId) {
    return !!(await this.bookRepository.bookIsForUser(id, userId));
  }
}
