import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { DataSource, In, Like, Repository } from 'typeorm';
import { MovieDetail } from './entities/movie-datail.entity';
import { Director } from 'src/director/entities/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/entities/user.entity';

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
  ) {}

  async findAll(title?: string) {
    // title 이 없는 경우
    if (!title) {
      return [
        await this.movieRepository.find({
          relations: ['director', 'genres'],
        }),
        await this.movieRepository.count(),
      ];
    }

    // title이 있는 경우
    return this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      relations: ['director', 'genres'],
    });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director', 'genres'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto, creator: User) {
    // 1. Director 검증
    const director = await this.directorRepository.findOne({
      where: { id: createMovieDto.directorId },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 Director 입니다.');
    }

    // 2. Genres 검증
    const genres = await this.genreRepository.findBy({
      id: In(createMovieDto.genreIds),
    });

    if (genres.length !== createMovieDto.genreIds.length) {
      throw new NotFoundException(
        `존재하지 않는 장르가 있습니다. ids: ${genres.map((genre) => genre.id).join(',')}`,
      );
    }

    // 3. Movie 생성
    const movie = this.movieRepository.create({
      title: createMovieDto.title,
      director,
      detail: { detail: createMovieDto.detail }, // cascade로 MovieDetail 자동 저장
      genres,
      creator,
    });

    // 4. 한 번의 save로 Movie + MovieDetail + ManyToMany genres 연결
    const savedMovie = await this.movieRepository.save(movie);

    return await this.movieRepository.findOne({
      where: { id: savedMovie.id },
      relations: ['detail', 'director', 'genres', 'creator'],
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'genres', 'director'],
    });

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
      const director = await this.directorRepository.findOne({
        where: { id: directorId },
      });

      if (!director) {
        throw new NotFoundException('존재하지 않는 감독입니다. ');
      }

      movie.director = director;
    }

    // 4. genres 교체
    if (genreIds) {
      const genres = await this.genreRepository.findBy({ id: In(genreIds) });

      if (genres.length !== updateMovieDto.genreIds?.length) {
        throw new NotFoundException(
          `존재하지 않는 장르가 있습니다. ids:  ${genres.map((genre) => genre.id).join(',')}`,
        );
      }

      movie.genres = genres;
    }

    await this.movieRepository.save(movie);

    return this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    // detail은 cascade: true 설정으로 삭제 시 자동 삭제됨
    await this.movieRepository.delete(movie);

    return id;
  }
}
