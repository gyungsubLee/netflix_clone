import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('cats')
export class CatsController {
  @Public()
  @Get()
  findAll(@Req() req: any) {
    return ['테스트'];
  }
}
