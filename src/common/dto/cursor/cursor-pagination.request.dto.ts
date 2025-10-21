import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CursorPaginationReqDto {
  @IsString()
  @IsOptional()
  cursor?: string; // ex. 'id_52,likeCount_20'

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  order: string[] = ['id_DESC']; // ex. ['likeCount_DESC', 'id_DESC']

  @IsInt()
  @IsOptional()
  size: number = 5;
}
