import { Logger, Injectable, Options } from '@nestjs/common';
import { GetBookmarkDataDto } from './dto/requests/get-bookmark-data.dto';
import { BookmarkDataDto } from './dto/responses/bookmark-info.dto';
import { ManagerSupportException } from 'src/shared/exceptions/manager.support.exception';
import { PlaywrightService } from './playwright.service';
import type { Page, Locator } from 'playwright'
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import type { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly httpService: HttpService
  ) { }

  private readonly logger = new Logger(ScrapperService.name);

  async getBookmarkData(getBookmarkDataDto: GetBookmarkDataDto): Promise<BookmarkDataDto> {
    this.logger.log('Gettting Bookmark Data...');

    const bookmarkContext = await this.playwrightService.Browser.newContext();
    bookmarkContext.setDefaultTimeout(0);

    const page: Page = await bookmarkContext.newPage();

    try {
      const gotoResponse = await page.goto(getBookmarkDataDto.webUrl);

      if (!gotoResponse || !gotoResponse.ok())
        throw new ManagerSupportException(`Failure`);

    } catch (e) {
      this.logger.error(`Failure in page load for webURL ${getBookmarkDataDto.webUrl}`);

      return {
        pageCover: undefined,
        pageTitle: "N/A Title",
        pageDescription: "N/A Description"
      };
    }

    // Cover
    const pageCover = await this.getCoverAsync(page);

    return {
      pageCover: pageCover,
      pageTitle: "dfsdfds",
      pageDescription: "fddsfds"
    };
  }

  private async getCoverAsync(page: Page) {
    const locator1 = page.locator("meta[property=\"og:image\"]");

    const imageURL: string = await this.retrieveAttributeValueAsync(locator1, "", "content");

    let coverImage: boolean | Blob = false;

    // Try to retrieve url cover, if fails then take screenshot
    if (imageURL.length > 0 && this.isValidHttpUrl(imageURL)) {

      const request = this.httpService
        .get<Blob>(imageURL, { responseType: "blob" })
        .pipe(
          map((res: AxiosResponse<Blob>) => {
            return res.data;
          }),
          catchError((error: AxiosError) => {
            this.logger.error(`Failure in cover of url ${imageURL} with message ${error.message}`);
            return of(false);
          }),
        );

      coverImage = await firstValueFrom(request);
    }

    // Take screenshot
    if (typeof coverImage === "boolean") {
      const bufferResponse = await page.screenshot({ type: "png" });
      return new Blob([bufferResponse]);;
    }
    else {
      return coverImage;
    }

  }

  private async retrieveAttributeValueAsync(
    locator: Locator,
    defaultValue: string,
    attributeName: string,
    stateValue: "attached" | "detached" | "visible" | "hidden" = "attached",
    timeOutValue: number = 0) {
    try {
      const locatorsCount: number = await locator.count();

      if (locatorsCount > 1) {
        locator = locator.first();
        await locator.waitFor({ state: stateValue, timeout: timeOutValue });
      }
      else if (locatorsCount == 1) {
        await locator.waitFor({ state: stateValue, timeout: timeOutValue });
      }
      else {
        return defaultValue;
      }

      const value: string | null = await locator.getAttribute(attributeName, { timeout: timeOutValue });

      return value === null || value.trim().length === 0 ? defaultValue : value
    }
    catch (e) {
      return defaultValue;
    }
  }

  private isValidHttpUrl(string: string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

}
