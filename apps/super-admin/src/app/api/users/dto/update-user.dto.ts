import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty()
  @IsInt()
  tenantId?: string;
}


export class UpdateUserPasswordDto {
  @ApiProperty({
    example: 'verySecurePassword123',
    description: 'Password',
    required: true,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: 'verySecurePassword123',
    description: 'Password',
    required: true,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  confirmpassword!: string;
}