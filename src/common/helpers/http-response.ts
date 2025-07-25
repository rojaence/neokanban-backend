import { HttpStatus } from '@nestjs/common';

export interface IHttpResponse<T> {
  statusCode: HttpStatus;
  message: string;
  data?: T;
  error?: T;
}

export class HttpResponse {
  static success<T>({
    data,
    message = 'Success',
    statusCode = HttpStatus.OK,
  }: IHttpResponse<T>) {
    return {
      statusCode,
      message,
      data,
    };
  }

  static error<T>(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error: T,
  ) {
    return {
      statusCode,
      message,
      error,
    };
  }
}
