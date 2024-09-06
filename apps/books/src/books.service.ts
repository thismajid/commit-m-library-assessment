import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from './repositories/book.repository';

@Injectable()
export class BooksService {
  constructor(private bookRepository: BookRepository) {}

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

    console.log(hasBook);

    if (!hasBook) {
      throw new BadRequestException();
    }

    return await this.bookRepository.update(data.id, data);
  }

  private async checkBookIsForUser(id, userId) {
    return !!(await this.bookRepository.bookIsForUser(id, userId));
  }
}
