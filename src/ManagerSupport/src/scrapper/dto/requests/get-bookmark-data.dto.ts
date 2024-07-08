import { ApiProperty } from '@nestjs/swagger';

export class GetBookmarkDataDto {
  @ApiProperty({ example: 'www.contoso.com' })
  webUrl: string;
}

