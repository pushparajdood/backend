import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from '@nestjs/class-validator';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'admin@demo-hs.edu',
    description: 'User email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    example: 'orgadmin123',
    description: 'Password',
    required: true,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password?: string;
}


export class RegisterAuthDto {

  @ApiProperty({
    example: 'johnss.doe@example.com',
    description: 'User email address',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Male',
    description: 'Gender of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty({
    example: '2000-11-01',
    description: 'DOB of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  date_of_birth: string;

  @ApiProperty({
    example: 'verySecurePassword123',
    description: 'Password',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}