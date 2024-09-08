// book.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { ServiceResponse } from '@app/interfaces/response.interface';
import { Book } from './generated/prisma-client-books';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @GrpcMethod('BookService', 'AddBook')
  async addBook(data: {
    title: string;
    author: string;
    category: string;
    userId: number;
  }): Promise<ServiceResponse<Book>> {
    const result = await this.booksService.addBook(data);
    return {
      success: true,
      message: 'Book added successfully',
      data: result,
    };
  }

  @GrpcMethod('BookService', 'ListBooks')
  async listBooks(data: {
    page: number;
    limit: number;
  }): Promise<ServiceResponse<{ books: Book[]; total: number }>> {
    const result = await this.booksService.listBooks(data);
    return {
      success: true,
      message: 'Books retrieved successfully',
      data: result,
    };
  }

  @GrpcMethod('BookService', 'GetBook')
  async getBook(data: { id: number }): Promise<ServiceResponse<Book>> {
    const result = await this.booksService.getBook(data.id);
    return {
      success: true,
      message: 'Book retrieved successfully',
      data: result,
    };
  }

  @GrpcMethod('BookService', 'UpdateBook')
  async updateBook(data: {
    id: number;
    title: string;
    author: string;
    category: string;
    userId: number;
  }): Promise<ServiceResponse<Book>> {
    const result = await this.booksService.updateBook(data);
    return {
      success: true,
      message: 'Book updated successfully',
      data: result,
    };
  }

  @GrpcMethod('BookService', 'DeleteBook')
  async deleteBook(data: {
    id: number;
    userId: number;
  }): Promise<ServiceResponse<null>> {
    await this.booksService.deleteBook(data);
    return {
      success: true,
      message: 'Book deleted successfully',
    };
  }

  @GrpcMethod('BookService', 'SearchBooks')
  async searchBooks(data: {
    query: string;
    page: number;
    limit: number;
  }): Promise<ServiceResponse<{ books: Book[]; total: number }>> {
    const result = await this.booksService.searchBooks(data);
    return {
      success: true,
      message: 'Books searching retrieved successfully',
      data: result,
    };
  }

  @GrpcMethod('BookService', 'BorrowBook')
  async borrowBook(data: { id: number; userId: number }) {
    const result = await this.booksService.borrowBook(data);
    return {
      success: true,
      message: 'Book borrowed successfully',
      data: result,
    };
  }

  @GrpcMethod('BookService', 'ReturnBook')
  async returnBook(data: { id: number; userId: number }) {
    const result = await this.booksService.returnBook(data);
    return {
      success: true,
      message: 'Book returned successfully',
      data: result,
    };
  }
}
