import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseApiResponseDto<T> {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional({ type: Boolean })
  error?: boolean;

  @ApiProperty()
  data: T;
}

export class BaseApiPaginatedResponseDto<T> {
  @ApiProperty()
  success?: boolean;

  @ApiProperty()
  status?: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  error?: boolean;

  @ApiProperty()
  data: T[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;
}

export class BaseApiNullResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class NullResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class ApiResponseDto<T> extends NullResponseDto {
  @ApiProperty()
  data: T;
}