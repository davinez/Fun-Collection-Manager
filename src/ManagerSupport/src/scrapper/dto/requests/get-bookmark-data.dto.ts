import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetBookmarkDataDto {
  @ApiProperty({ example: 'www.contoso.com' })
  @IsNotEmpty()
  @IsUrl()
  webUrl: string;
}

