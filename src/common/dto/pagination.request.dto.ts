import { IsInt, IsOptional } from 'class-validator';

export class PaginationReqDto {
  @IsInt()
  @IsOptional()
  page: number = 1;

  @IsInt()
  @IsOptional()
  size: number = 5;
}
