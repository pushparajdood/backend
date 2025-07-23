import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from '@nestjs/class-validator';
import { IsString } from 'class-validator';

export class CreateRoleAttributeDto {
  @ApiProperty({
    example: 1,
    description: 'Role ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  role_id: string;

  @ApiProperty({
    example: 1,
    description: 'Attribute List ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  attribute_id: string;
}
