import { Prisma, PrismaService } from '@lms-backend/prisma-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRoleRepository {
  private readonly repo: Prisma.UserRoleDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.userRole;
  }

  async createUserRole(data: Prisma.UserRoleCreateInput) {
    return await this.repo.create({ data });
  }

  async updateUserRole(params: {
    where: Prisma.UserRoleWhereUniqueInput;
    data: Prisma.UserRoleUpdateInput;
  }) {
    const { where, data } = params;
    return await this.repo.update({ data, where });
  }

  async deleteUserRole(where: Prisma.UserRoleWhereUniqueInput) {
    return await this.repo.delete({ where });
  }

  async userRole(where: Prisma.UserRoleWhereUniqueInput) {
    return await this.repo.findUnique({
      where,
      include: {
        Role: true,
        User: true,
      },
    });
  }

  async userRoles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserRoleWhereUniqueInput;
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithAggregationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.repo.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { Role: true, User: true },
    });
  }

}
