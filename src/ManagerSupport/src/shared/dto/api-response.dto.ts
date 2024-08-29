import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiPropertyOptional({
    description: 'data object that contains the response',
  })
  data?: T;
}