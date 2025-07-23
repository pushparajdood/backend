import { SetMetadata } from '@nestjs/common';

export const Permission = (permission: Record<string, boolean>) =>
  SetMetadata('permission', permission);
