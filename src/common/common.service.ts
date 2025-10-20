import { Injectable } from '@nestjs/common';
import { ObjectLiteral, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { PagePaginationReqDto } from './dto/page/page-pagination.request.dto';

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
}
