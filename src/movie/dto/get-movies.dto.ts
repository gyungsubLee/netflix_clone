import { IsOptional, IsString } from 'class-validator';
import { PagePaginationReqDto } from 'src/common/dto/page/page-pagination.request.dto';

export class GetMoviesReqDto extends PagePaginationReqDto {
  @IsString()
  @IsOptional()
  title?: string;
}
