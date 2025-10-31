import { BadRequestException } from '@nestjs/common';

export enum Role {
  admin,
  paidUser,
  user,
}

export function roleNameFromNumber(n: number): string {
  if (Role[n] === undefined) {
    throw new BadRequestException(`유효하지 않은 role 숫자(0 ~ 2 가능): ${n}`);
  }

  return Role[n];
}
