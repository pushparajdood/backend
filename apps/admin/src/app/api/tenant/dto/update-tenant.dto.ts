import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @ApiProperty({ description: 'First name of the tenant admin' })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

}
