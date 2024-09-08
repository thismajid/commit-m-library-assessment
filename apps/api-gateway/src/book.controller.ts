import {
  Controller,
  Inject,
  Get,
  Req,
  Put,
  Body,
  Post,
  Query,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { BookService } from '@app/interfaces/book-service.interface';
import {
  ApiAddBook,
  ApiBorrowBook,
  ApiDeleteBook,
  ApiGetBook,
  ApiListBook,
  ApiReturnBook,
  ApiSearchBooks,
  ApiUpdateBook,
} from './decorators';

@ApiTags('books')
@Controller('books')
@UseInterceptors(GrpcResponseInterceptor)
export class BookController {
  private bookService: BookService;

  constructor(@Inject('BOOK_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.bookService = this.client.getService<BookService>('BookService');
  }

  @Post()
  @ApiAddBook()
  addBook(
    @Req() req,
    @Body() data: { title: string; author: string; category: string },
  ) {
    return this.bookService.addBook({
      ...data,
      userId: req.user.userId,
    });
  }

  @Get()
  @ApiListBook()
  listBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.bookService.listBooks({ page, limit });
  }

  @Get('search')
  @ApiSearchBooks()
  searchBooks(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.bookService.searchBooks({ query, page, limit });
  }

  @Get(':id')
  @ApiGetBook()
  getBook(@Param('id') id: number) {
    return this.bookService.getBook({ id });
  }

  @Put(':id')
  @ApiUpdateBook()
  updateBook(
    @Param('id') id: number,
    @Body() data: { title: string; author: string; category: string },
  ) {
    return this.bookService.updateBook({
      id,
      ...data,
    });
  }

  @Delete(':id')
  @ApiDeleteBook()
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook({
      id,
    });
  }

  @Post(':id/borrow')
  @ApiBorrowBook()
  borrowBook(@Param('id') id: number, @Body('userId') userId: number) {
    return this.bookService.borrowBook({ id, userId });
  }

  @Post(':id/return')
  @ApiReturnBook()
  returnBook(@Param('id') id: number, @Body('userId') userId: number) {
    return this.bookService.returnBook({ id, userId });
  }
}
