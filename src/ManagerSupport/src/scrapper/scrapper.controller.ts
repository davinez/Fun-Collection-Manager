import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiResponse } from '../common/dto/api-response.dto';
import { ScrapperService } from './scrapper.service';
import { GetBookmarkDataDto } from './dto/requests/get-bookmark-data.dto';
import { BookmarkDataDto } from './dto/responses/bookmark-info.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Scrapper')
@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) { }

  @Post('bookmark')
  async getBookmarkData(@Body() getBookmarkDataDto: GetBookmarkDataDto): Promise<ApiResponse<BookmarkDataDto>> {
    const data = await this.scrapperService.getBookmarkData(getBookmarkDataDto);

    return {
      data: data
    }
  }

}
