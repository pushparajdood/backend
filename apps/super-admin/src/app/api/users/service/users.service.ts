import { TenantRepository, UsersRepository, UsersRoleRepository } from '@lms-backend/data-access';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class UsersService {
  constructor(
    private readonly tenantRepo: TenantRepository,
    private readonly userRepo: UsersRepository,
    private readonly usersRoleRepo: UsersRoleRepository,
  ) { }

   async createUser(data: Prisma.UserCreateInput) {
    return this.userRepo.createUser(data);
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.userRepo.updateUser({ data, where });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput, data: any) {
    return this.userRepo.softDelete(where, data);
  }

  async user(where: Prisma.UserWhereUniqueInput) {
    return this.userRepo.findOne(where);
  }

  async User(params: {
    page?: number;
    limit?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
  }) {
    const { page, limit, cursor, where, orderBy } = params;
    return this.userRepo.users({
      skip: limit * (page - 1),
      take:limit,
      cursor,
      where,
      orderBy,
    });
  }

  async userCount(params: { where?: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.userRepo.count({ where });
  }

  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
  }) {
    const [items, total,activeTotal,inActiveTotal] = await Promise.all([
      this.userRepo.findMany(params),
      this.userRepo.count({}),
      this.userRepo.count({ where: {is_deleted:false} }),
      this.userRepo.count({ where: {is_deleted:true} }),
    ]);
    return [items, total,activeTotal,inActiveTotal];
  }

  async createUserRole(data: Prisma.UserRoleCreateInput) {
    return await this.usersRoleRepo.createUserRole(data);
  }

  async updateUserRole(params: {
    where: Prisma.UserRoleWhereUniqueInput;
    data: Prisma.UserRoleUpdateInput;
  }) {
    const { where, data } = params;
    return await this.usersRoleRepo.updateUserRole({ data, where });
  }

  async deleteUserRole(where: Prisma.UserRoleWhereUniqueInput) {
    return await this.usersRoleRepo.deleteUserRole(where);
  }

  async userRole(where: Prisma.UserRoleWhereUniqueInput) {
    return await this.usersRoleRepo.userRole(where);
  }

  async userRoleOne(where: Prisma.UserRoleWhereUniqueInput) {
    return await this.usersRoleRepo.userRole(where);
  }

  async userRoles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserRoleWhereUniqueInput;
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithAggregationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.usersRoleRepo.userRoles({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
