import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiPropertyOptional({ type: "T" })
  data?: T;
}