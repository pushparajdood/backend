import { PartialType } from '@nestjs/swagger';
import { CreateRoleAttributeDto } from './create-role-attribute.dto';

export class UpdateRoleAttributeDto extends PartialType(
  CreateRoleAttributeDto
) {}
