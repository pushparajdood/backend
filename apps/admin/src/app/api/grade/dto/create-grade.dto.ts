import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CreateGradeDto {
  @ApiProperty({
    example: 'Grade 1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
