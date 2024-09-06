import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class GrpcResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            throw new HttpException(
              data.message || 'Operation failed',
              HttpStatus.BAD_REQUEST,
            );
          }
          return data;
        }
        return data;
      }),
      catchError((err) => {
        throw new HttpException(
          err.response || 'Operation failed',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}
