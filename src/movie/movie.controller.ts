import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor as CI,
  Req,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Role } from 'src/user/entities/user.entity';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('movie')
@UseInterceptors(CI)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Public()
  getMovices(@Query('title') title?: string) {
    return this.movieService.findAll(title);
  }

  @Get(':id')
  @Public()
  getMovie(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }

  @Post()
  @RBAC(Role.admin)
  postMovie(@Req() req, @Body() body: CreateMovieDto) {
    return this.movieService.create(body, req.user);
  }

  @Patch(':id')
  @RBAC(Role.admin)
  patchMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.movieService.update(+id, body);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}
