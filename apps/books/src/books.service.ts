import { Injectable } from '@nestjs/common';
import { BookRepository } from './repositories/book.repository';

@Injectable()
export class BooksService {
  constructor(private bookRepository: BookRepository) {}

  async addBook(data: { title: string; author: string; category: string }) {
    return this.bookRepository.create({
      ...data,
      isAvailable: true,
      userId: 1,
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
    console.log(id);

    return await this.bookRepository.findOne(id);
  }
}
