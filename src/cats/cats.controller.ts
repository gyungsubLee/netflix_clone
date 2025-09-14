import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() req: any) {
    return ['테스트'];
  }
}
