// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from '../../interceptors/src/ResponseWrapper.interceptor';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     console.log(exception);

//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;

//     const message =
//       exception instanceof HttpException
//         ? exception.message
//         : 'Internal server error';

//     const responseBody: Response<null> = {
//       success: false,
//       data: null,
//       error: message,
//       statusCode: status,
//       message: this.getStatusMessage(status),
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     };

//     response.status(status).json(responseBody);
//   }

//   private getStatusMessage(status: number): string {
//     switch (status) {
//       case HttpStatus.BAD_REQUEST:
//         return 'Bad Request';
//       case HttpStatus.UNAUTHORIZED:
//         return 'Unauthorized';
//       case HttpStatus.FORBIDDEN:
//         return 'Forbidden';
//       case HttpStatus.NOT_FOUND:
//         return 'Not Found';
//       case HttpStatus.INTERNAL_SERVER_ERROR:
//         return 'Internal Server Error';
//       default:
//         return 'Unknown Error';
//     }
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    // If the exception is an HttpException, get its response
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // Check if the response is a string or an object and handle accordingly
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse['message']
      ) {
        message = Array.isArray(exceptionResponse['message'])
          ? exceptionResponse['message'].join(', ')
          : exceptionResponse['message'];
      }
    }

    response.status(status).json({
      success: false,
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
