import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Tamil',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}