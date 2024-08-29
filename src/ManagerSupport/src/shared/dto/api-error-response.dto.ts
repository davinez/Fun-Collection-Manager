import { ApiProperty, } from '@nestjs/swagger';

export class ApiError {
  @ApiProperty()
  domain?: string;

  @ApiProperty()
  reason?: string;

  @ApiProperty()
  message?: string;
}

class ApiTopLevelError {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message?: string;

  @ApiProperty({ type: ApiError, isArray: true })
  errors: ApiError[];
}

export class ApiErrorResponseDto {
  @ApiProperty({
    type: String,
    example: "1.0",
  })
  apiVersion: string;

  @ApiProperty({ type: ApiTopLevelError })
  error: ApiTopLevelError;
}






