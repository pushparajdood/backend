import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from '../dto/create-attribute.dto';
import { UpdateAttributeDto } from '../dto/update-attribute.dto';
import { AttributeRepository } from '@lms-backend/data-access';
import { Prisma } from '@lms-backend/prisma-client';

@Injectable()
export class AttributeService {
  constructor(private attributeRepository: AttributeRepository) { }


  async create(createAttributeDto: CreateAttributeDto) {
    return await this.attributeRepository.createAttribute(createAttributeDto);
  }

  async findOne(id: string) {
    return await this.attributeRepository.Attribute({ attribute_id: id });
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    return await this.attributeRepository.updateAttribute({
      where: { attribute_id: id },
      data: updateAttributeDto,
    });
  }

  delete(id: string, data: any) {
    return this.attributeRepository.deleteAttribute(data, { role_id: id });
  }


  async findAndCount(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AttributeWhereInput;
    orderBy?: Prisma.AttributeOrderByWithAggregationInput;
  }) {
    const [items, total] = await Promise.all([
      this.attributeRepository.findMany(params),
      this.attributeRepository.count({ where: params.where }),
    ]);
    return [items, total];
  }
}
