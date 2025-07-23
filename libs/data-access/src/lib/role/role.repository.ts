import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class RoleRepository {
  private readonly repo: Prisma.RoleDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.role;
  }
  async createRole(data: Prisma.RoleCreateInput) {
    return this.repo.create({ data });
  }

  async updateRole(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }) {
    const { where, data } = params;
    return this.repo.update({ data, where });
  }

  async deleteRole(where: Prisma.RoleWhereUniqueInput, data: any) {
    return this.repo.update({ data, where });
  }

  async role(where: Prisma.RoleWhereUniqueInput) {
    return this.repo.findUnique({
      where,
      include: { roleAttributes: true, userRoles: true },
    });
  }

  async roles() {
    return await this.repo.findMany();
  }

  async deleteRoles(where: Prisma.RoleWhereUniqueInput) {
    return this.repo.delete({ where });
  }

  async count(params: { where?: Prisma.RoleWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: {
        roleAttributes: true,
        userRoles: true,
      },
    });
  }
}
