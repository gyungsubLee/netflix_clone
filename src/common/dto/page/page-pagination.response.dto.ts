export class PagePaginationResDto<T> {
  readonly data: T[];
  readonly size: number;
  readonly page: number;
  readonly totalCount?: number;
  readonly totalPage?: number;

  private constructor(
    data: T[],
    size: number,
    page: number,
    totalCount?: number,
  ) {
    this.data = data;
    this.size = size;
    this.page = page;

    if (totalCount !== undefined) {
      this.totalCount = totalCount;
      this.totalPage = Math.ceil(totalCount / size);
    }

    Object.freeze(this);
  }

  static from<T>(data: T[], size: number, page: number, totalCount?: number) {
    return new PagePaginationResDto(data, size, page, totalCount);
  }
}
