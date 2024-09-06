import {
  Controller,
  Inject,
  HttpStatus,
  HttpException,
  Get,
  Req,
  UseGuards,
  Put,
  Body,
  Patch,
  Post,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';

interface BookService {
  addBook(data: {
    title: string;
    author: string;
    category: string;
    userId: number;
  }): Observable<{
    id: number;
    title: string;
    author: string;
    category: string;
    isAvailable: boolean;
    userId: number;
  }>;

  listBooks(data: { page: number; limit: number }): Observable<
    [
      {
        id: number;
        title: string;
        author: string;
        category: string;
        isAvailable: boolean;
        userId: number;
      },
    ]
  >;

  getBook(data: { id: number }): Observable<{
    id: number;
    title: string;
    author: string;
    category: string;
    isAvailable: boolean;
    userId: number;
  }>;

  updateBook(data: {
    id: number;
    title: string;
    author: string;
    category: string;
    userId: number;
  }): Observable<{
    id: number;
    title: string;
    author: string;
    category: string;
    isAvailable: boolean;
    userId: number;
  } | null>;

  deleteBook(data: { id: number; userId: number }): Observable<null>;

  searchBooks(data: { query: string; page: number; limit: number }): Observable<
    [
      {
        id: number;
        title: string;
        author: string;
        category: string;
        isAvailable: boolean;
        userId: number;
      },
    ]
  >;
}

@ApiTags('books')
@Controller('books')
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
  async addBook(
    @Req() req,
    @Body() data: { title: string; author: string; category: string },
  ) {
    const response = this.bookService.addBook({
      ...data,
      userId: req.user.userId,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Book created successfully',
      data: await lastValueFrom(response),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all books' })
  @ApiResponse({ status: 200, description: 'Returns a list of books' })
  async listBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
    const response = this.bookService.listBooks({ page, limit });

    return {
      statusCode: HttpStatus.OK,
      message: 'Books listed successfully',
      data: await lastValueFrom(response),
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search books' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of books matching the search query',
  })
  async searchBooks(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const response = this.bookService.searchBooks({ query, page, limit });

    return {
      statusCode: HttpStatus.OK,
      message: 'Books retrievied successfully',
      data: await lastValueFrom(response),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book' })
  @ApiResponse({ status: 200, description: 'Returns a book' })
  async getBook(@Param('id') id: number) {
    const response = this.bookService.getBook({ id });

    return {
      statusCode: HttpStatus.OK,
      message: 'Fetch book successfully',
      data: await lastValueFrom(response),
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  async updateBook(
    @Req() req,
    @Param('id') id: number,
    @Body() data: { title: string; author: string; category: string },
  ) {
    try {
      const response = this.bookService.updateBook({
        id,
        ...data,
        userId: req.user.userId,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Book updated successfully',
        data: await lastValueFrom(response),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Book update operation failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  async deleteBook(@Req() req, @Param('id') id: number) {
    try {
      this.bookService.deleteBook({
        id,
        userId: req.user.userId,
      });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Book deleted successfully',
        data: {},
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message || 'Book delete operation failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
