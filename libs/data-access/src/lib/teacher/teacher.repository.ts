import { Injectable } from '@nestjs/common';
import { PrismaService, Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class TeacherRepository {
  private readonly repo: Prisma.TeacherDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.teacher;
  }
  async create(data: Prisma.TeacherCreateInput) {
    return this.repo.create({ data });
  }

  async update(params: {
    where: Prisma.TeacherWhereUniqueInput;
    data: Prisma.TeacherUpdateInput;
  }) {
    const { where, data } = params;
    return this.repo.update({ data, where });
  }

  async softDelete(where: Prisma.TeacherWhereUniqueInput, data: Prisma.TeacherUpdateInput) {
    return this.repo.update({ data, where });
  }

  async teacher(where: Prisma.TeacherWhereUniqueInput) {
    return this.repo.findUnique({
      where,
    });
  }

  async teachers() {
    return await this.repo.findMany();
  }

  async delete(where: Prisma.TeacherWhereUniqueInput) {
    return this.repo.delete({ where });
  }

  async count(params: { where?: Prisma.TeacherWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithAggregationInput;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        subjects: {
          include: {
            subject: {
              select: {
                name: true,
                isActive: true
              }
            }
          },
          where: {
            is_deleted: false
          }
        },
      },
    });
  }
}
