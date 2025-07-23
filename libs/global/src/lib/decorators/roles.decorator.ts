import { SetMetadata } from '@nestjs/common';
import { Role } from '@lms-backend/libs';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
