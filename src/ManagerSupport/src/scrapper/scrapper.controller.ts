import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiResponse } from '../shared/dto/api-response.dto';
import { ScrapperService } from './scrapper.service';
import { GetBookmarkDataDto } from './dto/requests/get-bookmark-data.dto';
import { BookmarkDataDto } from './dto/responses/bookmark-data.dto';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ManagerSupportException } from 'src/shared/exceptions/manager.support.exception';
import { AuthGuard } from 'src/auth.guard';

@ApiTags('Scrapper')
@ApiSecurity('Api-Key')
@Controller('scrapper')
@UseGuards(AuthGuard)
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) { }

  @ApiOperation({
    summary: 'Get bookmark data scrapped from the url specified',
    description: 'Get bookmark data by url',
  })
  @ApiAcceptedResponse({
    description: 'Data scrapped',
    type: ApiResponse<BookmarkDataDto>,
    isArray: false,
  })
  @Post('bookmark')
  async getBookmarkData(@Body() getBookmarkDataDto: GetBookmarkDataDto): Promise<ApiResponse<BookmarkDataDto>> {
    
    const data = await this.scrapperService.getBookmarkData(getBookmarkDataDto);

    return {
      data: data
    }
  }

}
