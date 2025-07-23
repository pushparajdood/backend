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
import { AttributeService } from '../service/attribute.service';
import { CreateAttributeDto } from '../dto/create-attribute.dto';
import { UpdateAttributeDto } from '../dto/update-attribute.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';

@ApiTags('Attribute')
@ApiBearerAuth()
@Controller('attribute')
@UseGuards(RolesGuard)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) { }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  async create(@Body() createAttributeDto: CreateAttributeDto, @Request() req) {
    const createData = {
      ...createAttributeDto,
      created_by: req.raw.user.user_id,
    };
    return await this.attributeService.create(createData);
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
    const where = { is_deleted: false };
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

    const [items, total] = await this.attributeService.findAndCount(params);

    return { items, total };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.attributeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
    @Request() req
  ) {
    const updateData = {
      ...updateAttributeDto,
      updated_by: req.raw.user.user_id,
    };
    return await this.attributeService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    const deleteData = {
      is_deleted: true,
      deleted_by: req.raw.user.user_id,
      deleted_at: new Date(),
    };
    return await this.attributeService.delete(id, deleteData);
  }
}
