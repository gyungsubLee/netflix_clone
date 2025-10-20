import { Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { PagePaginationReqDto } from './dto/page/page-pagination.request.dto';
import { CursorPaginationReqDto } from './dto/cursor/cursor-pagination.request.dto';

@Injectable()
export class CommonService {
  constructor() {}

  applyPagePaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    page: number,
    size: number,
  ) {
    const skip = (page - 1) * size;

    qb.take(size);
    qb.skip(skip);
  }

  applyCursorPaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: CursorPaginationReqDto,
  ) {
    /** 단일 컬럼(id) Cursor Pagination */
    const { id, order, size } = dto;

    if (id) {
      const direction = order === 'ASC' ? '>' : '<';

      // ex) order = 'ASC',  movie.id > :id
      qb.where(`${qb.alias}.id ${direction} :id`, { id });
    }

    qb.orderBy(`${qb.alias}.id`, order);
    qb.take(size);
  }
}
