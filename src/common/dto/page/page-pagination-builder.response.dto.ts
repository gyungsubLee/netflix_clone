// FIXME: 사용 시 500 오류 발생됨, 해결 필요
class PaginationBuilder<T> {
  data: T[] = [];
  size = 10;
  page = 1;
  totalCount?: number;

  withData(data: T[]): this {
    this.data = data;
    return this;
  }
  withSize(size: number): this {
    this.size = size;
    return this;
  }
  withPage(page: number): this {
    this.page = page;
    return this;
  }
  withTotalCount(totalCount: number): this {
    this.totalCount = totalCount;
    return this;
  }

  build(): PagePaginationBuilderResDto<T> {
    return new PagePaginationBuilderResDto(this);
  }
}

export class PagePaginationBuilderResDto<T> {
  readonly data: T[];
  readonly size: number;
  readonly page: number;
  readonly totalCount?: number;
  readonly totalPage?: number;

  constructor(builder: PaginationBuilder<T>) {
    this.data = builder.data;
    this.size = builder.size;
    this.page = builder.page;

    if (builder.totalCount) {
      this.totalCount = builder.totalCount;
      this.totalPage = Math.ceil(builder.totalCount / builder.size);
    }

    Object.freeze(this);
  }

  static builder<T>() {
    return new PaginationBuilder<T>();
  }
}
