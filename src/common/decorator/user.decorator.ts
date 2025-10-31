import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request || !request.user) {
      throw new BadRequestException(
        '[Decorator/User] Request 객체에서 User 객체를 찾을 수 없습니다. 로그인 해주세요',
      );
    }

    return request.user;
  },
);
