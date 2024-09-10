import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { ClientGrpc } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

jest.mock('./guards', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
  JwtAdminAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: any;
  let mockClientGrpc: Partial<ClientGrpc>;

  beforeEach(async () => {
    mockBookService = {
      addBook: jest.fn(),
      listBooks: jest.fn(),
      searchBooks: jest.fn(),
      getBook: jest.fn(),
      updateBook: jest.fn(),
      deleteBook: jest.fn(),
      borrowBook: jest.fn(),
      returnBook: jest.fn(),
    };

    mockClientGrpc = {
      getService: jest.fn().mockReturnValue(mockBookService),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: 'BOOK_PACKAGE',
          useValue: mockClientGrpc,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    controller.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addBook', () => {
    it('should add a new book', async () => {
      const mockBook = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test Category',
      };
      mockBookService.addBook.mockReturnValue(of(mockBook));

      const result = await lastValueFrom(
        controller.addBook(1, {
          title: 'Test Book',
          author: 'Test Author',
          category: 'Test Category',
        }),
      );

      expect(mockBookService.addBook).toHaveBeenCalledWith({
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test Category',
        userId: 1,
      });
      expect(result).toEqual(mockBook);
    });

    it('should handle bad request error', async () => {
      mockBookService.addBook.mockReturnValue(
        throwError(() => new BadRequestException('Invalid book data')),
      );

      await expect(
        lastValueFrom(
          controller.addBook(1, { title: '', author: '', category: '' }),
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('listBooks', () => {
    it('should list books with default pagination', async () => {
      const mockBooks = { books: [{ id: 1, title: 'Book 1' }], total: 1 };
      mockBookService.listBooks.mockReturnValue(of(mockBooks));

      const result = await lastValueFrom(controller.listBooks());

      expect(mockBookService.listBooks).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockBooks);
    });

    it('should handle bad request error for invalid pagination', async () => {
      mockBookService.listBooks.mockReturnValue(
        throwError(
          () => new BadRequestException('Invalid pagination parameters'),
        ),
      );

      await expect(lastValueFrom(controller.listBooks(-1, 0))).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('searchBooks', () => {
    it('should search books', async () => {
      const mockBooks = {
        books: [{ id: 1, title: 'Matching Book' }],
        total: 1,
      };
      mockBookService.searchBooks.mockReturnValue(of(mockBooks));

      const result = await lastValueFrom(controller.searchBooks('test', 1, 10));

      expect(mockBookService.searchBooks).toHaveBeenCalledWith({
        query: 'test',
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockBooks);
    });

    it('should handle bad request error for invalid search query', async () => {
      mockBookService.searchBooks.mockReturnValue(
        throwError(() => new BadRequestException('Invalid search query')),
      );

      await expect(
        lastValueFrom(controller.searchBooks('', -1, 0)),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBook', () => {
    it('should get a book by id', async () => {
      const mockBook = { id: 1, title: 'Test Book' };
      mockBookService.getBook.mockReturnValue(of(mockBook));

      const result = await lastValueFrom(controller.getBook(1));

      expect(mockBookService.getBook).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockBook);
    });

    it('should handle not found error', async () => {
      mockBookService.getBook.mockReturnValue(
        throwError(() => new NotFoundException('Book not found')),
      );

      await expect(lastValueFrom(controller.getBook(999))).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const mockBook = {
        id: 1,
        title: 'Updated Book',
        author: 'Updated Author',
        category: 'Updated Category',
      };
      mockBookService.updateBook.mockReturnValue(of(mockBook));

      const result = await lastValueFrom(
        controller.updateBook(1, {
          title: 'Updated Book',
          author: 'Updated Author',
          category: 'Updated Category',
        }),
      );

      expect(mockBookService.updateBook).toHaveBeenCalledWith({
        id: 1,
        title: 'Updated Book',
        author: 'Updated Author',
        category: 'Updated Category',
      });
      expect(result).toEqual(mockBook);
    });

    it('should handle not found error', async () => {
      mockBookService.updateBook.mockReturnValue(
        throwError(() => new NotFoundException('Book not found')),
      );

      await expect(
        lastValueFrom(
          controller.updateBook(999, {
            title: 'Updated Book',
            author: 'Updated Author',
            category: 'Updated Category',
          }),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const mockResponse = { success: true };
      mockBookService.deleteBook.mockReturnValue(of(mockResponse));

      const result = await lastValueFrom(controller.deleteBook(1));

      expect(mockBookService.deleteBook).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockResponse);
    });

    it('should handle not found error', async () => {
      mockBookService.deleteBook.mockReturnValue(
        throwError(() => new NotFoundException('Book not found')),
      );

      await expect(lastValueFrom(controller.deleteBook(999))).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('borrowBook', () => {
    it('should borrow a book', async () => {
      const mockResponse = { success: true };
      mockBookService.borrowBook.mockReturnValue(of(mockResponse));

      const result = await lastValueFrom(controller.borrowBook(1, 1));

      expect(mockBookService.borrowBook).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle bad request error when book is not available', async () => {
      mockBookService.borrowBook.mockReturnValue(
        throwError(() => new BadRequestException('Book not available')),
      );

      await expect(lastValueFrom(controller.borrowBook(1, 1))).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('returnBook', () => {
    it('should return a book', async () => {
      const mockResponse = { success: true };
      mockBookService.returnBook.mockReturnValue(of(mockResponse));

      const result = await lastValueFrom(controller.returnBook(1, 1));

      expect(mockBookService.returnBook).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle bad request error when book was not borrowed', async () => {
      mockBookService.returnBook.mockReturnValue(
        throwError(() => new BadRequestException('Book was not borrowed')),
      );

      await expect(lastValueFrom(controller.returnBook(1, 1))).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
