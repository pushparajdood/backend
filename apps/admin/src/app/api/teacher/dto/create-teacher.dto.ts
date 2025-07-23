import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from '@nestjs/class-validator';

export class CreateTeacherDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  phone?: string;

  @ApiProperty({
    example: null,
    description: 'tenantId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  subject_id: string;

  @ApiProperty({
    example: null,
    description: 'tenantId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tenantId?: string;
}
