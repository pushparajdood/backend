import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateAttributeDto {
  @ApiProperty({
    example: 'AiSimpleAccess',
    description: 'Unique AttributeList',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'description',
    description: 'description',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

}
