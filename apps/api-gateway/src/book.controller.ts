import {
  Controller,
  Inject,
  Get,
  Req,
  UseGuards,
  Put,
  Body,
  Post,
  Query,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { BookService } from '@app/interfaces/book-service.interface';
import {
  AddBookDto,
  BorrowBookDto,
  ReturnBookDto,
  UpdateBookDto,
} from '@app/dtos/books.dto';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new book' })
  @ApiResponse({ status: 201, description: 'Book added successfully' })
  @ApiBody({ type: AddBookDto })
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
  @ApiOperation({ summary: 'List all books' })
  @ApiResponse({ status: 200, description: 'Returns a list of books' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  listBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.bookService.listBooks({ page, limit });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search books' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of books matching the search query',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search terms of the book',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  searchBooks(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.bookService.searchBooks({ query, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Returns a book' })
  getBook(@Param('id') id: number) {
    return this.bookService.getBook({ id });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiBody({ type: UpdateBookDto })
  updateBook(
    @Req() req,
    @Param('id') id: number,
    @Body() data: { title: string; author: string; category: string },
  ) {
    return this.bookService.updateBook({
      id,
      ...data,
      userId: req.user.userId,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  deleteBook(@Req() req, @Param('id') id: number) {
    return this.bookService.deleteBook({
      id,
      userId: req.user.userId,
    });
  }

  @Post(':id/borrow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Book borrowed successfully' })
  @ApiBody({ type: BorrowBookDto })
  borrowBook(@Param('id') id: number, @Body('userId') userId: number) {
    return this.bookService.borrowBook({ id, userId });
  }

  @Post(':id/return')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  @ApiBody({ type: ReturnBookDto })
  returnBook(@Param('id') id: number, @Body('userId') userId: number) {
    return this.bookService.returnBook({ id, userId });
  }
}
