import { Injectable } from '@nestjs/common';
import { GetBookmarkDataDto } from './dto/requests/get-bookmark-data.dto';
import { BookmarkDataDto } from './dto/responses/bookmark-info.dto';

@Injectable()
export class ScrapperService {

  async getBookmarkData(getBookmarkDataDto: GetBookmarkDataDto): Promise<BookmarkDataDto> {
    return {
      pageCover: "fdsdf",
      pageTitle: "dfsdfds",
      pageDescription: "fddsfds"
    };
  }

}
