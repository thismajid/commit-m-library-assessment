// book.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BooksService } from './books.service';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @GrpcMethod('BookService', 'AddBook')
  async addBook(data: {
    title: string;
    author: string;
    category: string;
    userId: number;
  }) {
    return this.booksService.addBook(data);
  }
}
