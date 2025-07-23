import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({ description: 'First name of the tenant admin' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
