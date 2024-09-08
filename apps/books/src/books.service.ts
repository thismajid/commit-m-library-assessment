import { Injectable } from '@nestjs/common';
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
  }): Promise<ServiceResponse<Book>> {
    const newBook = await this.bookRepository.create({
      ...data,
      isAvailable: true,
    });

    return {
      success: true,
      message: 'Book added successfully',
      data: newBook,
    };
  }

  async listBooks({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      this.bookRepository.findAll({ skip, take: limit }),
      this.bookRepository.count(),
    ]);
    return { books, total };
  }

  async getBook(id: number): Promise<ServiceResponse<Book>> {
    const book = await this.bookRepository.findOne(id);

    return {
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    };
  }

  async updateBook(data: {
    id: number;
    title: string;
    author: string;
    category: string;
    userId: number;
  }): Promise<ServiceResponse<Book>> {
    const hasBook = await this.checkBookIsForUser(data.id, data.userId);

    if (!hasBook) {
      return {
        success: false,
        message: 'Book not found by this id',
      };
    }

    const updatedBook = await this.bookRepository.update(data.id, data);

    return {
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    };
  }

  async deleteBook(data: {
    id: number;
    userId: number;
  }): Promise<ServiceResponse<null>> {
    const hasBook = await this.checkBookIsForUser(data.id, data.userId);

    if (!hasBook) {
      return { success: false, message: 'Book not found by this id' };
    }

    await this.bookRepository.remove(data.id);

    return {
      success: true,
      message: 'Book deleted successfully',
    };
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

  async borrowBook(data: {
    id: number;
    userId: number;
  }): Promise<ServiceResponse<null>> {
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

  async returnBook(data: {
    id: number;
    userId: number;
  }): Promise<ServiceResponse<null>> {
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
