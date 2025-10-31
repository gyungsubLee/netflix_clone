import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as any).error
        : 'Internal Server Error';

    const message =
      exception instanceof HttpException
        ? Array.isArray((exception.getResponse() as any).message)
          ? (exception.getResponse() as any).message.join(', ')
          : (exception.getResponse() as any).message
        : exception;

    return response.status(status).json({
      statusCode: status,
      error: error,
      path: request.url,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
