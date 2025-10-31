import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RBAC } from '../decorator/rbac.decorator';
import { Role, roleNameFromNumber } from '../enum/role.enum';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role>(RBAC, context.getHandler());

    // Role enum의 값이 데코레이터 들어갔는지 확인
    if (!Object.values(Role).includes(requiredRole)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    /**
     Global로 적용된 AuthGuard 실행 이후,
     Controller, Route 단위로 적용될 지금 이 Guard(RBACGuard)가 실행된다.
     따라서 AuthGuard에서 이미 user에 대한 검증을 하기 떄문에 단순한 존재 유무 확인 예외처리만 진행한다.
     */
    if (!user) {
      throw new UnauthorizedException({
        code: 'UNAUTHORIZED',
        message: '로그인이 필요합니다.',
      });
    }

    /**
        enum Role {
            admin = 0,
            paidUser = 1,
            user = 2,
        }

      * value 값은 TS가 자동 할당함
      * Role이 숫자가 작을수록 더 높은 권한을 의미
     */
    // JWT payload의 role은 number 타입으로 저장되므로 명시적으로 number 타입으로 비교
    const userRole = Number(user.role);
    const ok = userRole <= requiredRole;

    if (!ok) {
      throw new ForbiddenException({
        code: 'RBAC_FORBIDDEN',
        message: `권한 오류 - Required Role: ${roleNameFromNumber(requiredRole)}(${requiredRole}) [ Current User Role: ${roleNameFromNumber(userRole)}(${userRole}) ]`,
      });
    }

    return ok;
  }
}
