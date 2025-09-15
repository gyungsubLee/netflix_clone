import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/user/entities/user.entity';

@Controller('cats')
export class CatsController {
  @Public()
  @Get()
  findAll(@Req() req: any) {
    return ['조회는 public 권한으로 모든 사용자가 가능합니다.'];
  }

  @RBAC(Role.user)
  @Post()
  create() {
    return ['생성은 user 권한 이상 사용자(user, admin)만 가능합니다. '];
  }

  @RBAC(Role.admin)
  @Delete()
  delete() {
    return ['삭제는 관리자(admin)만 가능합니다. '];
  }
}
