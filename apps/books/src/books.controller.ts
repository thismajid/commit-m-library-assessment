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

  @GrpcMethod('BookService', 'ListBooks')
  async listBooks(data: { page: number; limit: number }) {
    return this.booksService.listBooks(data);
  }

  @GrpcMethod('BookService', 'GetBook')
  async getBook(data: { id: number }) {
    return this.booksService.getBook(data.id);
  }

  @GrpcMethod('BookService', 'UpdateBook')
  async updateBook(data: {
    id: number;
    title: string;
    author: string;
    category: string;
    userId: number;
  }) {
    return this.booksService.updateBook(data);
  }
}
