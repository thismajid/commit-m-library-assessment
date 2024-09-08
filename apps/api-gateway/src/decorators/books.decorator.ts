import { applyDecorators, HttpCode, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAdminAuthGuard, JwtAuthGuard } from '../guards';
import {
  AddBookDto,
  BorrowBookDto,
  ReturnBookDto,
  UpdateBookDto,
} from '@app/dtos/books.dto';

export const ApiAddBook = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add a new book' }),
    ApiResponse({ status: 201, description: 'Book added successfully' }),
    ApiBody({ type: AddBookDto }),
    HttpCode(201),
  );

export const ApiListBook = () =>
  applyDecorators(
    ApiOperation({ summary: 'List all books' }),
    ApiResponse({ status: 200, description: 'Books retrieved successfully' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page',
    }),
    HttpCode(200),
  );

export const ApiSearchBooks = () =>
  applyDecorators(
    ApiOperation({ summary: 'Search books' }),
    ApiResponse({
      status: 200,
      description: 'Books searching retrieved successfully',
    }),
    ApiQuery({
      name: 'query',
      required: false,
      type: String,
      description: 'Search terms of the book',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page',
    }),
    HttpCode(200),
  );

export const ApiGetBook = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a book' }),
    ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' }),
    ApiResponse({ status: 200, description: 'Book retrieved successfully' }),
    HttpCode(200),
  );

export const ApiUpdateBook = () =>
  applyDecorators(
    UseGuards(JwtAdminAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a book' }),
    ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' }),
    ApiResponse({ status: 200, description: 'Book updated successfully' }),
    ApiNotFoundResponse({
      status: 404,
      description: 'Book not found by this id',
    }),
    ApiBody({ type: UpdateBookDto }),
    HttpCode(200),
  );

export const ApiDeleteBook = () =>
  applyDecorators(
    UseGuards(JwtAdminAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a book' }),
    ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' }),
    ApiResponse({ status: 200, description: 'Book deleted successfully' }),
    ApiNotFoundResponse({
      status: 404,
      description: 'Book not found by this id',
    }),
    HttpCode(200),
  );

export const ApiBorrowBook = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Borrow a book' }),
    ApiParam({ name: 'id', type: 'string', description: 'The ID of the book' }),
    ApiResponse({ status: 200, description: 'Book borrowed successfully' }),
    ApiBadRequestResponse({
      status: 400,
      description: 'Book not available',
    }),
    ApiBody({ type: BorrowBookDto }),
    HttpCode(200),
  );

export const ApiReturnBook = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Return a book' }),
    ApiResponse({ status: 200, description: 'Book returned successfully' }),
    ApiBadRequestResponse({
      status: 400,
      description: 'Book not available',
    }),
    ApiBody({ type: ReturnBookDto }),
    HttpCode(200),
  );
