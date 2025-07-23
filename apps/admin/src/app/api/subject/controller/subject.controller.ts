import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { SubjectService } from '../service/subject.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';

@ApiTags('Subject')
@ApiBearerAuth()
@Controller('subject')
@UseGuards(RolesGuard)

export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async create(@Body() createSubjectDto: CreateSubjectDto, @Request() req) {

    const createData = {
      ...createSubjectDto,
      created_by: req.raw.user.user_id,
    };

    return this.subjectService.create(createData);
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

    const [items, total] = await this.subjectService.findAndCount(params);

    return { items, total };
  }

  @Get(':id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.subjectService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto, @Request() req) {
    const updateData = {
      ...updateSubjectDto,
      updated_by: req.raw.user.user_id,
      updated_at:new Date()
    };
    return await this.subjectService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    const deleteData = {
      is_deleted: true,
      deleted_by: req.raw.user.user_id,
      deleted_at: new Date(),
    };
    return await this.subjectService.softDelete(id, deleteData);
  }
}
