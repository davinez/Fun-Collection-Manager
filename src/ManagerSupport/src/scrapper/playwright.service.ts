import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import { chromium } from 'playwright-extra'
import type { Browser } from 'playwright'
// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
import StealthPlugin from 'puppeteer-extra-plugin-stealth'


@Injectable()
export class PlaywrightService implements OnApplicationBootstrap {
  public Browser: Browser;

  async onApplicationBootstrap() {
   // Add the plugin to playwright (any number of plugins can be added)
   chromium.use(StealthPlugin())

   this.Browser = await chromium.launch({ headless: true, chromiumSandbox: false })
}

}
