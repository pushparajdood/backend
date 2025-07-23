import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RoleAttributeService } from '../service/role-attribute.service';
import { CreateRoleAttributeDto } from '../dto/create-role-attribute.dto';
import { UpdateRoleAttributeDto } from '../dto/update-role-attribute.dto';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@lms-backend/prisma-client';

@ApiTags('Role Attribute')
@ApiBearerAuth()
@Controller('role-attribute')
@UseGuards(RolesGuard)
export class RoleAttributeController {
  constructor(private readonly roleAttributeService: RoleAttributeService) { }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  async create(@Body() createRoleAttributeDto: CreateRoleAttributeDto) {
    const { role_id, attribute_id } = createRoleAttributeDto;
    const createData = {
      role_id,
      attribute_id,
    };
    return await this.roleAttributeService.create(createData);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'Field to order by',
    example: 'attribute_id',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Order direction',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'limit',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'page number',
    example: 1,
  })
  async findAll(
    @Query('orderBy') orderBy?: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ) {
    const where = {};
    const orderByObj = orderBy ? { [orderBy]: order } : undefined;

    const skip = (limit != null && page != null)
      ? (page - 1) * limit
      : undefined;

    const params: {
      where: typeof where;
      orderBy?: typeof orderByObj;
      skip?: number;
      take?: number;
    } = {
      where,
      ...(orderByObj ? { orderBy: orderByObj } : {}),
      ...(skip != null ? { skip } : {}),
      ...(limit != null ? { take: Number(limit) } : {}),
    };

    const [items, total] = await this.roleAttributeService.findAndCount(params);

    return { items, total };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.roleAttributeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateRoleAttributeDto: UpdateRoleAttributeDto
  ) {
    const { role_id, attribute_id } = updateRoleAttributeDto;
    const updateData = {
      role_id,
      attribute_id,
    };
    return await this.roleAttributeService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    return await this.roleAttributeService.delete(id);
  }
}
