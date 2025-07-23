import { Global, Module } from '@nestjs/common';
import { PrismaClientModule } from '@lms-backend/prisma-client';
import { UsersRepository } from './user/user.repository';
import { TenantRepository } from './tenant/tenant.repository';
import { RoleRepository } from './role/role.repository';
import { AttributeRepository } from './role/attribute.repository';
import { RoleAttributeRepository } from './role/role-attribute.repository';
import { UsersRoleRepository } from './user';
@Global()
@Module({
  imports: [PrismaClientModule],
  controllers: [],
  providers: [
    UsersRepository,
    TenantRepository,
    RoleRepository,
    AttributeRepository,
    RoleAttributeRepository,
    UsersRoleRepository,
  ],
  exports: [
    UsersRepository,
    TenantRepository,
    RoleRepository,
    AttributeRepository,
    RoleAttributeRepository,
    UsersRoleRepository,
  ],
})
export class LibDataAccessModule { }
