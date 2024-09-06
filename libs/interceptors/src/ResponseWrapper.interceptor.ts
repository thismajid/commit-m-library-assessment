import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '@app/interfaces/response.interface';

@Injectable()
export class ResponseWrapperInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        return {
          success: this.isSuccessStatus(statusCode),
          data: data || null,
          error: this.isSuccessStatus(statusCode) && undefined,
          statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private isSuccessStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }
}
