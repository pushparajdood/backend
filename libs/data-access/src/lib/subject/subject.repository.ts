import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class SubjectRepository {
  private readonly repo: Prisma.SubjectDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.subject;
  }
  async create(data: Prisma.SubjectCreateInput) {
    return this.repo.create({ data });
  }

  async update(params: {
    where: Prisma.SubjectWhereUniqueInput;
    data: Prisma.SubjectUpdateInput;
  }) {
    const { where, data } = params;
    return this.repo.update({ data, where });
  }

  async softDelete(where: Prisma.SubjectWhereUniqueInput, data: Prisma.SubjectUpdateInput) {
    return this.repo.update({ data, where });
  }

  async subject(where: Prisma.SubjectWhereUniqueInput) {
    return this.repo.findUnique({
      where,
    });
  }

  async subjects() {
    return await this.repo.findMany();
  }

  async delete(where: Prisma.SubjectWhereUniqueInput) {
    return this.repo.delete({ where });
  }

  async count(params: { where?: Prisma.SubjectWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SubjectWhereInput;
    orderBy?: Prisma.SubjectOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
    });
  }
}
