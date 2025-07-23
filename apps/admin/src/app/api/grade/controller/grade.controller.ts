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
import { GradeService } from '../service/grade.service';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { UpdateGradeDto } from '../dto/update-grade.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';

@ApiTags('Grade')
@ApiBearerAuth()
@Controller('grade')
@UseGuards(RolesGuard)

export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async create(@Body() createGradeDto: CreateGradeDto, @Request() req) {
    const createData = {
      ...createGradeDto,
      created_by: req.raw.user.user_id,
    };

    return this.gradeService.create(createData);
  }

  @Get()
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'Field to order by',
    example: 'id',
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

    const [items, total] = await this.gradeService.findAndCount(params);

    return { items, total };
  }

  @Get(':id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.gradeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto, @Request() req) {
    const updateData = {
      ...updateGradeDto,
      updated_by: req.raw.user.user_id,
      updated_at:new Date()
    };
    return await this.gradeService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    const deleteData = {
      is_deleted: true,
      deleted_by: req.raw.user.user_id,
      deleted_at: new Date(),
    };
    return await this.gradeService.softDelete(id, deleteData);
  }
}
