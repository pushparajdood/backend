import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class RoleAttributeRepository {
  private readonly repo: Prisma.RoleAttributeDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.roleAttribute;
  }
  async createRoleAttribute(data: Prisma.RoleAttributeCreateInput) {
    return this.repo.create({ data });
  }

  async updateRoleAttribute(params: {
    where: Prisma.RoleAttributeWhereUniqueInput;
    data: Prisma.RoleAttributeUpdateInput;
  }) {
    const { where, data } = params;
    return this.repo.update({ data, where });
  }

  async deleteRoleAttribute(where: Prisma.RoleAttributeWhereUniqueInput, data: any) {
    return this.repo.update({ data, where });
  }

  async RoleAttribute(where: Prisma.RoleAttributeWhereUniqueInput) {
    return this.repo.findUnique({
      where,
      include: { Attribute: true, Role: true },
    });
  }

  async RoleAttributes() {
    return await this.repo.findMany();
  }

  async deleteRoleAttributes(where: Prisma.RoleAttributeWhereUniqueInput) {
    return this.repo.delete({ where });
  }

  async count(params: { where?: Prisma.RoleAttributeWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleAttributeWhereInput;
    orderBy?: Prisma.RoleAttributeOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { Attribute: true, Role: true },
    });
  }
}
