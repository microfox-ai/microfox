import puppeteer from 'puppeteer-core';
import { puppeteerLaunchProps } from '../spartacuz';

/**
 * Options for opening a new page.
 */
export interface OpenPageOptions {
  /**
   * The URL to navigate to.
   */
  url: string;
  /**
   * Viewport dimensions.
   */
  defaultViewport?: {
    width: number;
    height: number;
  };
  /**
   * Whether to run in headless mode.
   * @default false
   */
  headless?: boolean;
  /**
   * Whether to close the browser after the operation is complete.
   * @default false
   */
  isLocal?: boolean;
}

/**
 * Opens a new page in a browser instance and navigates to a URL.
 *
 * @param options - The options for opening the page.
 * @returns A promise that resolves to the Puppeteer page object.
 */
export async function openPage({
  url,
  defaultViewport,
  headless,
  isLocal,
}: OpenPageOptions) {
  console.log(
    `Opening page with options: ${JSON.stringify({
      url,
      defaultViewport,
      headless,
      isLocal,
    })}`,
  );
  const launchProps = await puppeteerLaunchProps(
    defaultViewport,
    isLocal ?? false,
    headless,
  );
  console.log('Got puppeteer launch properties.');
  const browser = await puppeteer.launch(launchProps);
  console.log('Browser launched.');
  const page = await browser.newPage();
  console.log('New page created.');
  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log(`Navigated to URL: ${url}`);
  return { browser, page };
}
