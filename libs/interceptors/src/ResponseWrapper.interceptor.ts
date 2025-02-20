// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { IResponse } from '@app/interfaces/response.interface';

// @Injectable()
// export class ResponseWrapperInterceptor<T>
//   implements NestInterceptor<T, IResponse<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<IResponse<T>> {
//     const ctx = context.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     return next.handle().pipe(
//       map((data) => {
//         const statusCode = response.statusCode;
//         return {
//           success: this.isSuccessStatus(statusCode),
//           data: data?.data || null,
//           error: this.isSuccessStatus(statusCode) && undefined,
//           statusCode,
//           timestamp: new Date().toISOString(),
//           path: request.url,
//           message: data?.message,
//         };
//       }),
//     );
//   }

//   private isSuccessStatus(status: number): boolean {
//     return status >= 200 && status < 300;
//   }
// }

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseWrapperInterceptor<T>
  implements NestInterceptor<T, { success: boolean; message: string; data: T }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; message: string; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        ...data,
      })),
    );
  }
}
