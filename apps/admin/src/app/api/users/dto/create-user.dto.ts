import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  IsEnum,
} from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}

export class LoginResponseDto {
  user_id: string;
  email: string;
  access_token: string;
  role: string;
  user: object;
}

export class RefreshTokenDtoDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhdHlhQHN1bnZlcmFzb2Z0d2FyZS5jb20iLCJpYXQiOjE3MjYwNTQ5MzksImV4cCI6MTcyNjE0MTMzOX0.AfBqLQSFm6LefvrerjkkRH0imJTTiWOZS0-KZyWZ7OQ',
    description: 'token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token?: string;
}


export class CreateUserDto {
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
  tenantId?: string;
}

export class UserIdParams {
  @IsNotEmpty()
  id: string;
}


export class CreateUserRoleDto {
  @ApiProperty({
    example: 1,
    description: 'user_id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @ApiProperty({
    example: 1,
    description: 'Role',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  role_id!: string;
}