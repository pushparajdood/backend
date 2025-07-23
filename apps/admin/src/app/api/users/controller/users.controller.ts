import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UseGuards,
  Request,
  Body,
  ConflictException,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiBearerAuth, ApiQuery, ApiTags,ApiParam } from '@nestjs/swagger';
import { Role, Roles, RolesGuard } from '@lms-backend/libs';
import { CreateUserDto, CreateUserRoleDto, UserIdParams } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UpdateUserPasswordDto } from '../dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    
    const existingUser = await this.usersService.user({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email address already exists');
    }
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createData = {
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      firstName: createUserDto.firstName ?? "",
      lastName: createUserDto.lastName ?? "",
      tenantId:createUserDto.tenantId,
      created_by: req.raw.user.user_id,
    };
    const data = await this.usersService.createUser(createData);
    delete data.password;

    return data;
  }

  @Get()
  @Roles(Role.ORG_ADMIN,Role.ADMIN) 
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: 'Field to order by',
    example: 'user_id',
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

    const [items, total,activeTotal,inActiveTotal] = await this.usersService.findAndCount(params);

    return { items, total,activeTotal,inActiveTotal };
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User ID',
    example: 1,
  })
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async findOne(@Param() params: UserIdParams) {
    return await this.usersService.user({ user_id: params.id });
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User ID',
    example: 1,
  })
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async remove(@Param() params: UserIdParams, @Request() req) {
    const deleteData = {
      is_deleted: true,
      deleted_by: req.raw.user.user_id,
      deleted_at: new Date(),
    };
    return await this.usersService.deleteUser(
      { user_id: params.id },
      deleteData
    );
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User ID',
    example: 1,
  })
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async update(
    @Param() params: UserIdParams,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    const updateData = {
      email: updateUserDto.email,
      updated_by: req.raw.user.user_id,
      updated_at: new Date(),
    };

    const data = await this.usersService.updateUser({
      where: { user_id: params.id },
      data: updateData,
    });
    delete data.password;
    return data;
  }

  @Post('updatepassword')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async updatePassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Request() req
  ) {
    if (req.body.password !== req.body.confirmpassword) {
      throw new BadRequestException(
        'Password and Confirm Password does not match'
      );
    }
    const existingUser = await this.usersService.user({
      user_id: req.raw.user.user_id,
    });
    const isMatch: boolean = bcrypt.compareSync(
      req.body.password,
      existingUser.password
    );
    if (isMatch) {
      throw new BadRequestException(
        'The new password cannot be the same as the previous password.'
      );
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const UserPassword = {
      password: hashedPassword,
      updated_by: req.raw.user.user_id,
      updated_at: new Date(),
    };
    return await this.usersService.updateUser({
      where: { user_id: req.raw.user.user_id },
      data: UserPassword,
    });
  }

  @Post('user-role')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async createUserRole(@Body() createUserRoleDto: CreateUserRoleDto) {
    const createUserRoleData = {
      Role: { connect: { role_id: createUserRoleDto.role_id } },
      User: { connect: { user_id: createUserRoleDto.user_id } },
    };
    return await this.usersService.createUserRole(createUserRoleData);
  }

  @Get('user-role')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async findAllUserRole() {
    return await this.usersService.userRoles({});
  }

  @Get('user-role/:id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async findOneUserRole(@Param() params: UserIdParams) {
    return await this.usersService.userRole({ user_role_id: params.id });
  }

  @Patch('user-role/:id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async updateUserRole(
    @Param() params: UserIdParams,
    @Body() createUserRoleDto: CreateUserRoleDto
  ) {
    const updateUserRoleData = {
      Role: { connect: { role_id: createUserRoleDto.role_id } },
      User: { connect: { user_id: createUserRoleDto.user_id } },
    };
    return await this.usersService.updateUserRole({
      where: { user_role_id: params.id },
      data: updateUserRoleData,
    });
  }

  @Delete('user-role/:id')
  @Roles(Role.ORG_ADMIN,Role.ADMIN)
  async removeUserRole(@Param() params: UserIdParams) {
    return await this.usersService.deleteUserRole({
      user_role_id: params.id,
    });
  }
 
}
