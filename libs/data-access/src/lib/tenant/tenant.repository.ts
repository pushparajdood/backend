import { Prisma, PrismaService } from '@lms-backend/prisma-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantRepository {
  private readonly repo: Prisma.TenantDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.tenant;
  }

  async create(data: Prisma.TenantCreateInput) {
    return await this.repo.create({ data });
  }

  async update(params: {
    where: Prisma.TenantWhereUniqueInput;
    data: Prisma.TenantUpdateInput;
  }) {
    const { where, data } = params;
    return await this.repo.update({ data, where });
  }

  async delete(where: Prisma.TenantWhereUniqueInput, data: any) {
    return this.repo.update({ data, where });
  }

  async findOne(where: Prisma.TenantWhereUniqueInput) {
    return await this.repo.findUnique({
      where,
    });
  }

  async finds(where?: Prisma.TenantWhereInput) {
    return this.repo.findMany({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput;
    select?:Prisma.TenantSelect;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      select:params.select
    });
  }

  async findAll(params: {
    skip: number;
    take: number;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
    });
  }

  async count(params: { where?: Prisma.TenantWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

}
