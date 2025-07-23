import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class GradeRepository {
  private readonly repo: Prisma.GradeDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.grade;
  }
  async create(data: Prisma.GradeCreateInput) {
    return this.repo.create({ data });
  }

  async update(params: {
    where: Prisma.GradeWhereUniqueInput;
    data: Prisma.GradeUpdateInput;
  }) {
    const { where, data } = params;
    return this.repo.update({ data, where });
  }

  async softDelete(where: Prisma.GradeWhereUniqueInput, data: Prisma.GradeUpdateInput) {
    return this.repo.update({ data, where });
  }

  async grade(where: Prisma.GradeWhereUniqueInput) {
    return this.repo.findUnique({
      where,
    });
  }

  async grades() {
    return await this.repo.findMany();
  }

  async delete(where: Prisma.GradeWhereUniqueInput) {
    return this.repo.delete({ where });
  }

  async count(params: { where?: Prisma.GradeWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.GradeWhereInput;
    orderBy?: Prisma.GradeOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
    });
  }
}
