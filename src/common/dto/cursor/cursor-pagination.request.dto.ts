import { IsIn, IsInt, IsOptional } from 'class-validator';

export class CursorPaginationReqDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order: 'ASC' | 'DESC' = 'DESC';

  @IsInt()
  @IsOptional()
  size: number = 5;
}
