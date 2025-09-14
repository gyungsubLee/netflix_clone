import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 만약 public decoration이 있으면 bypass(통과) 처리
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(Public, [
        context.getHandler(), // 1) 헨들러(라우터) 먼저 탐색
        context.getClass(), // 2) 이후 클래스(컨트롤러) 탐색
      ]) ?? false; // 3) 탐색 후 값이 없는 경우, undefind를 반환함 이를 명시적으로 false 처리

    if (isPublic) {
      return true;
    }

    // 요청에서 user 객체가 존재하는지 확인
    const request = context.switchToHttp().getRequest();

    if (!request.user || request.user.type !== 'access') {
      return false;
    }

    return true;
  }
}
