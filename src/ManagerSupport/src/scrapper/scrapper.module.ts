import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { PlaywrightService } from './playwright.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      //maxRedirects: 5,
    }),
  ],
  exports: [],
  controllers: [ScrapperController],
  providers: [ScrapperService, PlaywrightService],
})
export class ScrapperModule {}
