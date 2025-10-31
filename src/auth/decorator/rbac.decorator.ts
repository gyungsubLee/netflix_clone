import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';

export const RBAC = Reflector.createDecorator<Role>();
