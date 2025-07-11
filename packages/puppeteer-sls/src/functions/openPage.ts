import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { puppeteerLaunchProps } from '../spartacuz';

puppeteer.use(StealthPlugin());

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
  /**
   * whether to wait complete page load
   * @default true
   */
  waitUntil?: 'networkidle2' | 'networkidle0' | 'domcontentloaded' | 'load';
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
  waitUntil,
}: OpenPageOptions) {
  console.log(
    `Opening page with options: ${JSON.stringify({
      url,
      defaultViewport,
      headless,
      isLocal,
    })}`,
  );
  try {
    const launchProps = await puppeteerLaunchProps(
      defaultViewport,
      isLocal ?? false,
      headless,
    );
    console.log('Got puppeteer launch properties.');
    const browser = await puppeteer.launch(
      !headless
        ? {
            ...launchProps,
            slowMo: 100,
          }
        : launchProps,
    );
    console.log('Browser launched.');
    const page = await browser.newPage();
    console.log('New page created.');
    const pageLoad = await page.goto(url, {
      waitUntil: waitUntil ?? 'networkidle2',
    });
    console.log(`Navigated to URL: ${pageLoad?.url()}`);
    return { browser, page };
  } catch (error) {
    console.error('Error opening page:', error);
    throw error;
  }
}
