import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { IsPasswordValid } from 'src/common/validator/password.validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsPasswordValid()
  // password: string;
}
