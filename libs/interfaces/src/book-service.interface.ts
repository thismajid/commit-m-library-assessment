import { Observable } from 'rxjs';

export interface AddBookInput {
  title: string;
  author: string;
  category: string;
  userId: number;
}

export interface ListBooksInput {
  page: number;
  limit: number;
}

export interface GetBookInput {
  id: number;
}

export interface UpdateBookInput {
  id: number;
  title: string;
  author: string;
  category: string;
  userId: number;
}

export interface DeleteBookInput {
  id: number;
  userId: number;
}

export interface SearchBooksInput {
  query: string;
  page: number;
  limit: number;
}

export interface BorrowBookInput {
  id: number;
  userId: number;
}

export interface ReturnBookInput {
  id: number;
  userId: number;
}

// Define output types
export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isAvailable: boolean;
  userId: number;
}

export interface BorrowReturnResponse {
  success: boolean;
  message: string;
}

export interface BookService {
  addBook(data: AddBookInput): Observable<Book>;
  listBooks(data: ListBooksInput): Observable<Book[]>;
  getBook(data: GetBookInput): Observable<Book>;
  updateBook(data: UpdateBookInput): Observable<Book | null>;
  deleteBook(data: DeleteBookInput): Observable<null>;
  searchBooks(data: SearchBooksInput): Observable<Book[]>;
  borrowBook(data: BorrowBookInput): Observable<BorrowReturnResponse>;
  returnBook(data: ReturnBookInput): Observable<BorrowReturnResponse>;
}
