import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 400;

    console.log(exception);

    let message = '데이터베이스 에러 발생';

    if (exception.message.includes('duplicate key')) {
      message = '유니크 제약 조건 오류 - 중복 값 할당';
    }

    response.status(status).json({
      statusCode: status,
      error: 'DATABASE_ERROR',
      path: request.url,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
