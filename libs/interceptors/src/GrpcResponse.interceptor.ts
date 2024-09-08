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
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    return next.handle().pipe(
      map((response) => {
        // Flatten the response by extracting the "data" from the inner response
        const { success, message, data } = response;

        return {
          success,
          message, // Use the message from the response
          data: data?.data ?? data, // Ensure only the inner "data" is returned
          timestamp: new Date().toISOString(),
          path: request?.url || '', // Include the request path if available
        };
      }),
    );
  }
}
