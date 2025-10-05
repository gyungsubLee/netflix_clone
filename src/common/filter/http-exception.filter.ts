import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch() // 특정 예외만 잡고 싶으면 (TypeError)처럼 클래스 지정 가능
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const [status, message] =
      exception instanceof HttpException
        ? [exception.getStatus(), exception.getResponse()]
        : [HttpStatus.INTERNAL_SERVER_ERROR, exception];

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
