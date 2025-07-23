import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: 'First name of the tenant admin' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'Last name of the tenant admin' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'Email of the tenant admin', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number of the tenant admin' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Password of the tenant admin' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateTenantDto {
  @ApiProperty({ description: 'Human‑readable name of the tenant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'URL or key for the tenant image/logo', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Primary domain for the tenant (must be unique)' })
  @IsString()
  @IsOptional()
  domain: string;

  @ApiProperty({ description: 'School code identifier for the tenant' })
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({ description: 'School city identifier for the tenant' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ description: 'School state identifier for the tenant' })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ description: 'School address identifier for the tenant' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ description: 'School country identifier for the tenant' })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ description: 'School postalcode identifier for the tenant' })
  @IsString()
  @IsOptional()
  postalcode: string;
}
