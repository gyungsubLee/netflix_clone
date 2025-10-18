import { IsOptional, IsString } from 'class-validator';
import { PaginationReqDto } from 'src/common/dto/pagination.request.dto';

export class GetMoviesReqDto extends PaginationReqDto {
  @IsString()
  @IsOptional()
  title?: string;
}
