import { Injectable } from '@nestjs/common';
import { BookRepository } from './repositories/book.repository';

@Injectable()
export class BooksService {
  constructor(private bookRepository: BookRepository) {}

  async addBook(data: { title: string; author: string; category: string }) {
    console.log(data);

    return this.bookRepository.create({
      ...data,
      isAvailable: true,
      userId: 1,
    });
  }
}
