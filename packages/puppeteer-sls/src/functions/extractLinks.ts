import { Page } from 'puppeteer-core';
import { openPage, OpenPageOptions } from './openPage';

export type ExtractedLink = {
  href: string;
  displayName: string;
  type: 'statix' | 'webpage';
  inPageLink: boolean;
  externalLink: boolean;
  internalLink: boolean;
  staticType?: 'video' | 'image' | 'file' | 'other';
  fileExtension?: string;
};

/**
 * Opens a page and extracts all links.
 *
 * @param options - The options for opening the page.
 * @returns A promise that resolves to an array of links.
 */
export async function extractLinks(page: Page): Promise<ExtractedLink[]> {
  const links: ExtractedLink[] = await page.evaluate(() => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    const videoExtensions = ['.mp4', '.mov', '.avi'];
    const fileExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.zip',
      '.rar',
    ];

    return Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href]'),
    ).map(anchor => {
      const hrefAttr = anchor.getAttribute('href') || '';
      const href = anchor.href;
      const displayName = anchor.innerText.trim();
      const inPageLink = hrefAttr.startsWith('#');

      let externalLink = false;
      let isWebLink = false;
      let url: URL | undefined;

      try {
        url = new URL(href);
        isWebLink = true;
        externalLink = url.hostname !== window.location.hostname;
      } catch (e) {
        isWebLink = false;
        externalLink = false;
      }

      const internalLink = isWebLink && !externalLink && !inPageLink;

      const linkResult: {
        href: string;
        displayName: string;
        type: 'statix' | 'webpage';
        inPageLink: boolean;
        externalLink: boolean;
        internalLink: boolean;
        staticType?: 'video' | 'image' | 'file' | 'other';
        fileExtension?: string;
      } = {
        href,
        displayName,
        type: 'webpage',
        inPageLink,
        externalLink,
        internalLink,
      };

      if (url) {
        const pathname = url.pathname;
        const extMatch = pathname.match(/\.([^/.]+)$/);
        if (extMatch) {
          const ext = `.${extMatch[1].toLowerCase()}`;

          if (imageExtensions.includes(ext)) {
            linkResult.type = 'statix';
            linkResult.staticType = 'image';
            linkResult.fileExtension = ext.substring(1);
          } else if (videoExtensions.includes(ext)) {
            linkResult.type = 'statix';
            linkResult.staticType = 'video';
            linkResult.fileExtension = ext.substring(1);
          } else if (fileExtensions.includes(ext)) {
            linkResult.type = 'statix';
            linkResult.staticType = 'file';
            linkResult.fileExtension = ext.substring(1);
          }
        }
      }

      return linkResult;
    });
  });
  return links;
}

export interface ExtractLinksOptions extends OpenPageOptions {
  onlyExternal?: boolean;
  onlyInternal?: boolean;
  onlyInPage?: boolean;
  onlyStatic?: boolean;
}

export async function extractLinksFromUrl(options: ExtractLinksOptions) {
  const { browser, page } = await openPage(options);
  const links = await extractLinks(page);
  await browser.close();
  return links;
}
