import { DefaultValuePipe, Injectable, NotFoundException, ParseIntPipe, Query } from '@nestjs/common';
import { RoleRepository } from '@lms-backend/data-access';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) { }

  async createRole(createRoleDto: CreateRoleDto) {
    const roleData = await this.roleRepository.role({
      name: createRoleDto.name,
    });
    console.log("🚀 ~ RoleService ~ createRole ~ roleData:", roleData)

    if (roleData) {
      throw new NotFoundException('Role Already Exists!');
    }
    return this.roleRepository.createRole(createRoleDto);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {

    return this.roleRepository.updateRole({
      where: { role_id: id },
      data: updateRoleDto,
    });
  }

  async deleteRole(id: string, data: any) {
    return this.roleRepository.deleteRole(data, { role_id: id });
  }

  async role(id: string) {
    return this.roleRepository.role({ role_id: id });
  }

  async roles() {
    return this.roleRepository.roles();
  }

  async deleteRoles(id: string) {
    return this.roleRepository.deleteRoles({ role_id: id });
  }

  async roleCount(params: { where?: Prisma.RoleWhereInput }) {
    const { where } = params;
    return this.roleRepository.count({ where });
  }

  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithAggregationInput;
  }) {
    const [items, total] = await Promise.all([
      this.roleRepository.findMany(params),
      this.roleRepository.count({ where: params.where }),
    ]);
    return [items, total];
  }
}
