import { Logger, Injectable } from '@nestjs/common';
import { GetBookmarkDataDto } from './dto/requests/get-bookmark-data.dto';
import { BookmarkDataDto } from './dto/responses/bookmark-info.dto';


@Injectable()
export class ScrapperService {

  private readonly logger = new Logger(ScrapperService.name);
  // constructor(
  //   private readonly logger: PinoLogger
  // ) {
  //   // Optionally you can set context for logger in constructor or ...
  //   this.logger.setContext(ScrapperService.name);
  // }

  async getBookmarkData(getBookmarkDataDto: GetBookmarkDataDto): Promise<BookmarkDataDto> {
    this.logger.log('Gettting Bookmark Data...');
   
    return {
      pageCover: "fdsdf",
      pageTitle: "dfsdfds",
      pageDescription: "fddsfds"
    };
  }

}
