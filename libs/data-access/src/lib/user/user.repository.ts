import { Prisma, PrismaService } from '@lms-backend/prisma-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private readonly repo: Prisma.UserDelegate;
  constructor(readonly prisma: PrismaService) {
    this.repo = this.prisma.user;
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await this.repo.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return await this.repo.update({ data, where });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return await this.repo.delete({ where });
  }

  async softDelete(where: Prisma.UserWhereUniqueInput,data:any) {
    return await this.repo.update({ data, where });
  }

  async user(where: Prisma.UserWhereUniqueInput) {
    return await this.repo.findUnique({
      where,
      include: {
        userRoles: true
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.repo.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { userRoles: true },
    });
  }

  async findOne(
    where: Prisma.UserWhereUniqueInput,
    include?: Prisma.UserInclude
  ) {
    return this.repo.findUnique({
      where,
      // include: include || {
      //   userRoles: true
      // },
    });
  }

  async findUserRole(id: string) {
    return await this.repo.findUnique({
      where: { user_id: id },
      include: {
        userRoles: {
          include: {
            Role: true,
          },
        },
      },
    });
  }

  async finds(where?: Prisma.UserWhereInput) {
    return this.repo.findMany({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
    select?:Prisma.UserSelect;
  }) {
    return this.repo.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { tenant: true },
    });
  }

  async count(params: { where?: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.repo.count({ where });
  }

  async findFirst(args?: Prisma.UserFindFirstArgs) {
    return await this.repo.findFirst(args);
  }

}
