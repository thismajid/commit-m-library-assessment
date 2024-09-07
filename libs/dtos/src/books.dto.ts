import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class AddBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the book',
    example: 'title',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The author of the book',
    example: 'author',
  })
  author: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The category of the book',
    example: 'category',
  })
  category: string;
}

export class PaginationDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
  })
  page?: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
  })
  limit?: number = 10;
}

export class ListBooksDto extends PaginationDto {}

export class SearchBooksDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search terms of the book' })
  query?: string;
}

export class UpdateBookDto extends AddBookDto {}

export class BorrowBookDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The userId of the borrowing book',
    example: 1,
  })
  userId: number;
}

export class ReturnBookDto extends BorrowBookDto {}
