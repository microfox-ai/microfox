import { Page } from 'puppeteer-core';
import { openPage, OpenPageOptions } from './openPage';
import TurndownService from 'turndown';
export type ExtractWebpageContentOptions = OpenPageOptions & {
  /**
   * Whether to convert the content to Markdown.
   * @default false
   */
  toMarkdown?: boolean;
  /**
   * Whether to convert the content to HTML.
   * @default false
   */
  toHTML?: boolean;
};

/**
 * Opens a page and converts its content to Markdown.
 *
 * @param options - The options for opening the page.
 * @returns A promise that resolves to the Markdown content of the page.
 */
export async function extractToMarkdown(page: Page) {
  const html = await page.evaluate(() => document.body.innerHTML);

  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);

  return markdown;
}

/**
 * Opens a page and extracts its full HTML content.
 *
 * @param options - The options for opening the page.
 * @returns A promise that resolves to the HTML content of the page.
 */
export async function extractHTML(page: Page) {
  const content = await page.evaluate(() => document.documentElement.outerHTML);
  return content;
}

/**
 * Opens a page and extracts its text content.
 *
 * @param options - The options for opening the page.
 * @returns A promise that resolves to the text content of the page.
 */
export async function extractWebpage(options: ExtractWebpageContentOptions) {
  const { browser, page } = await openPage(options);
  const content = await page.evaluate(() => document.body.innerText);
  const markdown = options.toMarkdown
    ? await extractToMarkdown(page)
    : undefined;
  const html = options.toHTML ? await extractHTML(page) : undefined;
  return {
    content,
    browser,
    markdown,
    html,
    page,
  };
}
