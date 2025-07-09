import { Page } from 'puppeteer-core';
import { openPage, OpenPageOptions } from './openPage';

export interface ExtractedImage {
  src: string | null;
  srcset: string | null;
  responsiveImages: { url: string; size: string }[] | null;
  alt: string | null;
}

export async function extractImages(page: Page): Promise<ExtractedImage[]> {
  const images = await page.$$eval('img', (imgs: HTMLImageElement[]) =>
    imgs.map((img: HTMLImageElement) => {
      return {
        src: img.getAttribute('src'),
        srcset: img.getAttribute('srcset'),
        responsiveImages:
          img
            .getAttribute('srcset')
            ?.split(',')
            ?.map(src => {
              const [url, size] = src.split(' ');
              if (!url) {
                return null;
              }
              return {
                url: url.trim(),
                size: size ? size.trim() : '',
              };
            })
            .filter(item => item !== null) || null,
        alt: img.getAttribute('alt'),
      };
    }),
  );
  return images;
}

export async function extractImagesFromURL(options: OpenPageOptions) {
  const { browser, page } = await openPage(options);
  const images = await extractImages(page);
  await browser.close();
  return images;
}
