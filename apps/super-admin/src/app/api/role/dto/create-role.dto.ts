import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Role } from '@lms-backend/libs';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Unique role name',
    enum: Role,
    example: Role.SUPER_ADMIN,
  })
  @IsEnum(Role, { message: 'name must be a valid RoleName' })
  name: Role;


  @ApiProperty({
    example: 'description',
    description: 'description',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}