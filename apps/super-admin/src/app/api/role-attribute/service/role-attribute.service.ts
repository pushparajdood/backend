import { Injectable } from '@nestjs/common';
import { CreateRoleAttributeDto } from '../dto/create-role-attribute.dto';
import { UpdateRoleAttributeDto } from '../dto/update-role-attribute.dto';
import { RoleAttributeRepository } from '@lms-backend/data-access';
import { Prisma } from '@lms-backend/prisma-client';
import { create } from 'node:domain';
import { Role } from '@lms-backend/libs';

@Injectable()
export class RoleAttributeService {
  constructor(private roleAttributeRepository: RoleAttributeRepository) { }

  async create(createRoleAttributeDto: CreateRoleAttributeDto) {

    const { role_id, attribute_id } = createRoleAttributeDto;
    const createData = {
      Role: { connect: { role_id } },
      Attribute: { connect: { attribute_id } },
    }
    return await this.roleAttributeRepository.createRoleAttribute(createData);
  }

  async findOne(id: string) {
    return await this.roleAttributeRepository.RoleAttribute({ role_attribute_id: id });
  }

  async update(id: string, updateRoleAttributeDto: UpdateRoleAttributeDto) {
    const { role_id, attribute_id } = updateRoleAttributeDto;
    const updateData = {
      Role: { connect: { role_id } },
      Attribute: { connect: { attribute_id } },
    }
    return await this.roleAttributeRepository.updateRoleAttribute({
      where: { role_attribute_id: id },
      data: updateData,
    });
  }

  delete(id: string) {
    return this.roleAttributeRepository.deleteRoleAttributes({ role_attribute_id: id });
  }


  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RoleAttributeWhereInput;
    orderBy?: Prisma.RoleAttributeOrderByWithAggregationInput;
  }) {
    const [items, total] = await Promise.all([
      this.roleAttributeRepository.findMany(params),
      this.roleAttributeRepository.count({ where: params.where }),
    ]);
    return [items, total];
  }
}
