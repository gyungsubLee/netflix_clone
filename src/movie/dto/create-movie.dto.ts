import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @IsNumber()
  directorId: number;

  @ArrayNotEmpty()
  @IsString({
    each: true,
  })
  @Type(() => Number)
  genreIds: number[];

  // @IsString()
  // movieFileName: string;
}
