import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Column,
  ObjectLiteral,
  QueryBuilder,
  SelectQueryBuilder,
} from 'typeorm';
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

  async applyCursorPaginationParamsToQb<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    dto: CursorPaginationReqDto,
  ) {
    let { cursor, order, size } = dto;

    // cursor 값이 존재하는 경우, 해당 정보로 오버라이딩
    if (cursor) {
      const decoderCursor = Buffer.from(cursor, 'base64').toString('utf-8');

      /** 
        { 
          values: { id: 27 },
          order: ['id_DESC']
        } 
     */
      const cursorObj = JSON.parse(decoderCursor);

      order = cursorObj.order; // array
      const { values } = cursorObj; // object

      /** Case 1. 
        WHERE (column1 > value1)
        OR  (column1 = value1 AND column2 < value2)
        OR  (column1 = value1 AND column2 = value2 AND column3 > value3)
      */

      /** Case 2. 
        (column1, column2, column3) > (value1, value2, value3)
       */
      const columns = Object.keys(values);
      const comparisonOperator = order.some((o) => o.endsWith('DESC'))
        ? '<'
        : '>';
      const whereConditions = columns.map((c) => `${qb.alias}.${c}`).join(',');
      const whereParams = columns.map((c) => `:${c}`).join(',');

      qb.where(
        `(${whereConditions}) ${comparisonOperator} (${whereParams})`,
        values,
      );
    }

    // ["likeCount_DESC", "id_DESC"]
    for (let i = 0; i < order.length; i++) {
      const [column, direction] = order[i].split('_');

      if (direction !== 'ASC' && direction !== 'DESC') {
        throw new BadRequestException(
          "Order는 'ASC' 또는 'DESC'로 입력해주세요.",
        );
      }

      if (i === 0) {
        qb.orderBy(`${qb.alias}.${column}`, direction);
      } else {
        qb.addOrderBy(`${qb.alias}.${column}`, direction);
      }
    }

    qb.take(size);

    const results = await qb.getMany();

    const nextCursor = this.generateNextCursor(results, order);

    return { qb, nextCursor };
  }

  private generateNextCursor<T>(results: T[], order: string[]): string | null {
    /** 
      { 
        values: { id: 27 },
        order: ['id_DESC']
      } 
     */
    const lastItem = results[results.length - 1]; // 마지막 요소
    const values = {};

    order.forEach((ColumnOrder) => {
      const [column] = ColumnOrder.split('_');
      values[column] = lastItem[column];
    });

    const cursorObj = { values, order };
    const nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString(
      'base64',
    );

    return nextCursor;
  }
}
