import { puppeteerLaunchProps } from '@microfox/puppeteer-sls';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

export class LinkedInPublic {
  /**
   * The Puppeteer browser instance.
   */
  public browser: Browser | null = null;
  /**
   * The Puppeteer page instance.
   */
  public page: Page | null = null;

  constructor() { }

  async launch(options?: { headless?: boolean }) {
    const launchProps = await puppeteerLaunchProps();
    const isLocal = process.env.IS_OFFLINE || process.env.SERVERLESS_OFFLINE;

    this.browser = await puppeteer.launch({
      ...launchProps,
      headless: options?.headless ?? true,
      slowMo: isLocal ? 50 : 0,
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async goto(url: string, options?: Parameters<Page['goto']>[1]) {
    if (!this.page) {
      throw new Error('Page not initialized. Call launch() first.');
    }
    return this.page.goto(url, options);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
} 