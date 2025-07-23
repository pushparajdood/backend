import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class AttributeRepository {
  private readonly repo: Prisma.AttributeDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.attribute;
  }
  async createAttribute(data: Prisma.AttributeCreateInput) {
    return this.repo.create({ data });
  }

  async updateAttribute(params: {
    where: Prisma.AttributeWhereUniqueInput;
    data: Prisma.AttributeUpdateInput;
  }) {
    const { where, data } = params;
    return this.repo.update({ data, where });
  }

  async deleteAttribute(where: Prisma.AttributeWhereUniqueInput, data: any) {
    return this.repo.update({ data, where });
  }

  async Attribute(where: Prisma.AttributeWhereUniqueInput) {
    return this.repo.findUnique({
      where,
      include: { roleAttributes: true },
    });
  }

  async Attributes() {
    return await this.repo.findMany();
  }

  async deleteAttributes(where: Prisma.AttributeWhereUniqueInput) {
    return this.repo.delete({ where });
  }

  async count(params: { where?: Prisma.AttributeWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AttributeWhereInput;
    orderBy?: Prisma.AttributeOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { roleAttributes: true },
    });
  }
}
