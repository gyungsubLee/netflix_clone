import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MovieDetail } from './entities/movie-datail.entity';
import { Director } from 'src/director/entities/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/entities/user.entity';
import { GetMoviesReqDto } from './dto/get-movies.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly dataSource: DataSource,
    private readonly commonService: CommonService,
  ) {}

  async findAllByTitle(dto: GetMoviesReqDto) {
    const { title } = dto;

    const qb = this.dataSource
      .getRepository(Movie)
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.detail', 'detail');

    if (title) {
      qb.where('movie.title LIKE :title', { title: `%${title}%` });
    }

    const { nextCursor } =
      await this.commonService.applyCursorPaginationParamsToQb(qb, dto);

    const [data, count] = await qb.getManyAndCount();

    return { data, nextCursor, count };
  }

  async findOne(id: number) {
    const movie = await this.dataSource
      .getRepository(Movie)
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.detail', 'detail')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.creator', 'creator')
      .where('movie.id = :id', { id })
      .getOne();

    if (!movie) {
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    return movie;
  }

  async create(
    creator: User,
    qr: QueryRunner,
    dto: CreateMovieDto,
    file?: Express.Multer.File,
  ) {
    // 1. Director 검증
    const director = await qr.manager
      .getRepository(Director)
      .createQueryBuilder('director')
      .where('director.id = :id', { id: dto.directorId })
      .getOne();

    if (!director) {
      throw new NotFoundException('존재하지 않는 Director 입니다.');
    }

    // 2. Genres 검증

    const genres = await this.validateGenres(qr, dto.genreIds);

    // 3. MovieDetail 생성
    const movieDetail = qr.manager.getRepository(MovieDetail).create({
      detail: dto.detail,
    });

    const savedDetail = await qr.manager
      .getRepository(MovieDetail)
      .save(movieDetail);

    // 4. Movie 생성
    const movieData: Partial<Movie> = {
      title: dto.title,
      director,
      detail: savedDetail,
      genres,
      creator,
    };

    // 파일이 업로드된 경우 파일 경로 추가
    if (file) {
      movieData.movieFilePath = `/movie/${file.filename}`;
    }

    const movie = qr.manager.getRepository(Movie).create(movieData);

    const savedMovie = (await qr.manager
      .getRepository(Movie)
      .save(movie)) as Movie;

    // 4. 한 번의 save로 Movie + MovieDetail + ManyToMany genres 연결

    return qr.manager
      .getRepository(Movie)
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.detail', 'detail')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.creator', 'creator')
      .where('movie.id = :id', { id: savedMovie.id })
      .getOne();
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      const movie = await this.dataSource
        .getRepository(Movie)
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.detail', 'detail')
        .leftJoinAndSelect('movie.genres', 'genres')
        .leftJoinAndSelect('movie.director', 'director')
        .where('movie.id = :id', { id })
        .getOne();

      if (!movie) {
        throw new NotFoundException('존재하지 않는 영화입니다.');
      }

      const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

      // 1. Movie 필드 업데이트
      Object.assign(movie, movieRest);

      // 2. detail 업데이트
      if (detail) {
        movie.detail.detail = detail;
      }

      // 3. director 교체
      if (directorId) {
        const director = await this.dataSource
          .getRepository(Director)
          .createQueryBuilder('director')
          .where('director.id = :id', { id: directorId })
          .getOne();

        if (!director) {
          throw new NotFoundException('존재하지 않는 감독입니다. ');
        }

        movie.director = director;
      }

      // 4. genres 교체
      if (genreIds) {
        const genres = await this.validateGenres(qr, genreIds);

        movie.genres = genres;
      }

      await this.dataSource.getRepository(Movie).save(movie);

      const updatedMovie = this.dataSource
        .getRepository(Movie)
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.detail', 'detail')
        .leftJoinAndSelect('movie.director', 'director')
        .leftJoinAndSelect('movie.genres', 'genres')
        .where('movie.id = :id', { id })
        .getOne();

      await qr.commitTransaction();

      return updatedMovie;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async remove(id: number) {
    const movie = await this.dataSource
      .getRepository(Movie)
      .createQueryBuilder('movie')
      .where('movie.id = :id', { id })
      .getOne();

    if (!movie) {
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    await this.dataSource.getRepository(Movie).delete({ id });

    return id;
  }

  private async validateGenres(
    qr: QueryRunner,
    ids: number[],
  ): Promise<Genre[]> {
    const genres = await qr.manager
      .getRepository(Genre)
      .createQueryBuilder('genre')
      .where('genre.id IN (:...ids)', { ids })
      .getMany();

    if (genres.length !== ids.length) {
      const foundIds = genres.map((g) => g.id);
      const missingIds = ids
        .map((id) => Number(id))
        .filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `존재하지 않는 장르가 있습니다. ids: ${missingIds.join(',')}`,
      );
    }

    return genres;
  }
}
