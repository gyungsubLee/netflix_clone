import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RBAC } from '../decorator/rbac.decorator';
import { Role } from 'src/user/entities/user.entity';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role>(RBAC, context.getHandler());

    // Role enum의 값이 데코레이터 들어갔는지 확인
    if (!Object.values(Role).includes(role)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    // Global로 적용된 AuthGuard 실행 이후,
    // Controller, Route 단위로 적용될 지금 이 Guard(RBACGuard)가 실행된다.
    // 따라서 AuthGuard에서 이미 user에 대한 검증을 하기 떄문에 단순한 존재 유무 확인 예외처리만 진행한다.
    if (!user) {
      return false;
    }

    /**
        enum Role {
            admin = 0,
            paidUser = 1,
            user = 2,
        }

        value 값은 TS가 자동 할당함
     */
    return user.role <= role;
  }
}
