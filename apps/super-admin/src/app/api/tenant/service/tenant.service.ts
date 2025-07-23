import { ConflictException, Injectable, Param } from '@nestjs/common';
import { Prisma, PrismaService } from '@lms-backend/prisma-client';
import { TenantRepository, UsersRepository } from '@lms-backend/data-access';
import * as bcrypt from 'bcrypt';
import { Role, TenantStatus} from '@lms-backend/libs';

@Injectable()
export class TenantService {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly userRepo: UsersRepository,
    private prisma: PrismaService
  ) { }

  async create(data: any) {
    const admin = data.admin;
    const passwordHash = await bcrypt.hash(admin.password, 12);
	  const existingUser = await this.userRepo.findFirst({
      where: {
        OR: [
          { email: admin.email },
          { phone: admin.phone }
        ]
      }
    });

    const existingDomain = await this.tenantRepository.findOne({domain:data.domain});

    if (existingUser) {
      if (existingUser.email === admin.email) {
        throw new ConflictException('Email address already exists');
      }
      if (existingUser.phone === admin.phone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    if (existingDomain) {
      throw new ConflictException('Domain already exists');
    }
	
    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: data.name,
          domain: data.domain,
          image: data.image ?? '',
          code: data.code ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          country: data.country ?? '',
          addressLine1: data.address ?? '',
          postalCode: data.postalCode ?? '',
          created_by: data.created_by
        }
      });

      // 2) create user linked to tenant
      const user = await tx.user.create({
        data: {
          email: admin.email,
          password: passwordHash,
          firstName: admin.first_name,
          lastName: admin.last_name,
          phone: admin.phone,
          tenantId: tenant.tenant_id,
          created_by: data.created_by
        }
      });
      const roleRecord = await tx.role.findUnique({ where: { name: Role.ADMIN } })

      const userRole = await tx.userRole.create({
        data: {
          user_id: user.user_id,
          role_id: roleRecord.role_id
        }
      });

      return { tenant, user, userRole };
    });
  }

  async tenants(params: {
    skip: number;
    take: number;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput;
  }) {
    const [items, total,activeTotal,inActiveTotal,suspended] = await Promise.all([
      this.tenantRepository.findAll(params),
      this.tenantRepository.count({}),
      this.tenantRepository.count({ where: {is_deleted:false} }),
      this.tenantRepository.count({ where: {isActive:false} }),
      this.tenantRepository.count({ where: {is_deleted:true} }),
    ]);
    return [items, total,activeTotal,inActiveTotal,inActiveTotal,suspended];
  }

  async tenantList() {
    return await this.tenantRepository.findMany({
      select: {
        tenant_id:true,
        name:true,
      },
    });
  }

  tenant(where: Prisma.TenantWhereUniqueInput) {
    return this.tenantRepository.findOne(where);
  }

  update(tenantId: string, updateTenantDto: any) {
    const admin = updateTenantDto.admin;
    return this.prisma.$transaction(async tx => {
      const tenant = await tx.tenant.update({
        where: { tenant_id: tenantId },
        data: {
          name: updateTenantDto.name,
          domain: updateTenantDto.domain,
          image: updateTenantDto.image ?? '',
          code: updateTenantDto.code ?? '',
          city: updateTenantDto.city ?? '',
          state: updateTenantDto.state ?? '',
          country: updateTenantDto.country ?? '',
          addressLine1: updateTenantDto.address ?? '',
          postalCode: updateTenantDto.postalCode ?? '',
          updated_at: updateTenantDto.updated_at,
          updated_by: updateTenantDto.updated_by
        },
      });

      const user = await tx.user.update({
        where: { user_id: updateTenantDto.user_id },
        data: {
          firstName: admin.first_name,
          lastName: admin.last_name,
          updated_at: updateTenantDto.updated_at,
          updated_by: updateTenantDto.updated_by
        },
      });

      return { tenant, user };
    });
  }

  delete(where: Prisma.TenantWhereUniqueInput, data: any) {
    return this.tenantRepository.update({ data, where });
  }

  statusUpdate(where: Prisma.TenantWhereUniqueInput, data: any) {
    return this.tenantRepository.update({ data, where });
  }

  async tenantCount(params: { where?: Prisma.TenantWhereInput }) {
    const { where } = params;
    return this.tenantRepository.count({ where });
  }

  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput;
  }) {
    const [items, total,activeTotal,inActiveTotal,suspended,pending] = await Promise.all([
      this.tenantRepository.findMany(params),
      this.tenantRepository.count({}),
      this.tenantRepository.count({ where: {status:TenantStatus.active} }),
      this.tenantRepository.count({ where: {status:TenantStatus.inactive} }),
      this.tenantRepository.count({ where: {status:TenantStatus.suspended} }),
      this.tenantRepository.count({ where: {status:TenantStatus.pending} }),
    ]);
    return [items, total,activeTotal,inActiveTotal,suspended,pending];
  }
}
