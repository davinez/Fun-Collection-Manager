import { Logger, Injectable, Options } from '@nestjs/common';
import { GetBookmarkDataDto } from './dto/requests/get-bookmark-data.dto';
import { BookmarkDataDto } from './dto/responses/bookmark-data.dto';
import { ManagerSupportException } from 'src/shared/exceptions/manager.support.exception';
import { PlaywrightService } from './playwright.service';
import type { Page, Locator } from 'playwright'
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import type { AxiosError, AxiosResponse } from 'axios';
import { isValidHttpUrl } from 'src/shared/utils/string.utils';

@Injectable()
export class ScrapperService {
  public defaultPageTitle = "N/A Title";
  public defaultPageDescription = "N/A Description";

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
        pageTitle: this.defaultPageTitle,
        pageDescription: this.defaultPageDescription
      };
    }

    // Cover
    const pageCover: string = await this.getCover(page);

    // Title
    const pageTitle: string = await this.getPageTitle(page);

    // Description
    const pageDescription: string = await this.getPageDescription(page);

    // Test Image 
    // const buffer = Buffer.from(pageCover);
    // const base64String = buffer.toString('base64');

    return {
      pageCover: pageCover,
      pageTitle: pageTitle,
      pageDescription: pageDescription
    };
  }

  private async getCover(page: Page) {
    const locator1 = page.locator("meta[property=\"og:image\"]");

    const imageURL: string = await this.retrieveAttributeValue(locator1, "", "content");

    let coverImage: boolean | ArrayBuffer = false;

    // Try to retrieve url cover, if fails then take screenshot
    if (imageURL.length > 0 && isValidHttpUrl(imageURL)) {

      const request = this.httpService
        .get<ArrayBuffer>(imageURL, { responseType: "arraybuffer" })
        .pipe(
          map((res: AxiosResponse<ArrayBuffer>) => {
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
      return bufferResponse.toString("base64");
    }
    else {
      // This step is only necessary if you don't already have a Buffer Object
      const buffer = Buffer.from(coverImage);
      return buffer.toString('base64');
    }

  }

  private async getPageTitle(page: Page) {

    const locator1 = page.locator("title");
    const locator2 = page.locator("meta[property=\"og:title\"]");

    let title: string = await this.retrieveTextContentValue(locator1, "");

    if (title === "") // default value
      title = await this.retrieveAttributeValue(locator2, this.defaultPageTitle, "content");

    return title;
  }

  private async getPageDescription(page: Page) {

    const locator1 = page.locator("meta[name=\"description\"]");
    const locator2 = page.locator("meta[property=\"og:description\"]");

    let description: string = await this.retrieveAttributeValue(locator1, "", "content");

    if (description === "") // default value
      description = await this.retrieveAttributeValue(locator2, this.defaultPageDescription, "content");

    return description;
  }

  private async retrieveTextContentValue(
    locator: Locator,
    defaultValue: string,
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

      const value: string | null = await locator.textContent({ timeout: timeOutValue });

      return value && value.trim().length !== 0 ? value : defaultValue
    }
    catch (e) {
      return defaultValue;
    }
  }

  private async retrieveAttributeValue(
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

      const value: null | string = await locator.getAttribute(attributeName, { timeout: timeOutValue });

      return value && value.trim().length !== 0 ? value : defaultValue
    }
    catch (e) {
      return defaultValue;
    }
  }

}
