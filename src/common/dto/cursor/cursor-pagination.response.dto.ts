export class CursorePaginationResDto<T> {
  readonly data: T[];
  readonly order: 'ASC' | 'DESC';
  readonly size: number;
  readonly remainingCount?: number;

  private constructor(
    data: T[],
    order: 'ASC' | 'DESC',
    size: number,
    remainingCount?: number,
  ) {
    this.data = data;
    this.order = order;
    this.size = size;

    if (remainingCount !== undefined) {
      this.remainingCount = remainingCount;
    }

    Object.freeze(this);
  }

  static from<T>(
    data: T[],
    order: 'ASC' | 'DESC',
    size: number,
    remainingCount?: number,
  ) {
    return new CursorePaginationResDto(data, order, size, remainingCount);
  }
}
