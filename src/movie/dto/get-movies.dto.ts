import { IsOptional, IsString } from 'class-validator';
import { CursorPaginationReqDto } from 'src/common/dto/cursor/cursor-pagination.request.dto';
import { PagePaginationReqDto } from 'src/common/dto/page/page-pagination.request.dto';

export class GetMoviesReqDto extends CursorPaginationReqDto {
  @IsString()
  @IsOptional()
  title?: string;
}
