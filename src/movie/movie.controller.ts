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
  ParseIntPipe,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { User as U } from 'src/user/entities/user.entity';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { GetMoviesReqDto } from './dto/get-movies.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/common/decorator/user.decorator';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/enum/role.enum';

@Controller('movie')
@UseInterceptors(CI)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Public()
  getMovicesByTitle(@Query() dto: GetMoviesReqDto) {
    return this.movieService.findAllByTitle(dto);
  }

  @Get(':id')
  @Public()
  getMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.findOne(id);
  }

  @Post()
  @RBAC(Role.admin)
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FileInterceptor('movie'))
  postMovie(
    @User() user: U,
    @QueryRunner() qr: QR,
    @Body() body: CreateMovieDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.movieService.create(user, qr, body, file);
  }

  @Patch(':id')
  @RBAC(Role.admin)
  patchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto,
  ) {
    return this.movieService.update(id, body);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }
}
