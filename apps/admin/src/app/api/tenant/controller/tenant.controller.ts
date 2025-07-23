import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { TenantService } from '../service/tenant.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { UpdateTenantDto } from '../dto/update-tenant.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';

@ApiTags('Tenant')
@ApiBearerAuth()
@Controller('tenant')
@UseGuards(RolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) { }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createTenantDto: CreateTenantDto, @Request() req) {
    const createData = {
      ...createTenantDto,
      created_by: req.raw.user.user_id,
    };
    return this.tenantService.create(createData);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'Field to order by',
    example: 'tenant_id',
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
    const [items, total,activeTotal,inActiveTotal] = await this.tenantService.findAndCount(params);

    return { items, total,activeTotal,inActiveTotal };
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.tenantService.tenant({ tenant_id: id });
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto, @Request() req) {
    const updateData = {
      ...updateTenantDto,
      updated_by: req.raw.user.user_id,
      updated_at: new Date()
    };
    return this.tenantService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    const deleteData = {
      is_deleted: true,
      deleted_by: req.raw.user.user_id,
      deleted_at: new Date(),
    };
    return this.tenantService.delete({ tenant_id: id }, deleteData);
  }
}
