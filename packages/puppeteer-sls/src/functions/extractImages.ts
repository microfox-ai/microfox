import { Page } from 'puppeteer-core';
import { openPage, OpenPageOptions } from './openPage';

export interface ExtractedImage {
  src: string | null;
  srcset: string | null;
  responsiveImages: { url: string; size: string }[] | null;
  alt: string | null;
}

export async function extractImages(page: Page): Promise<ExtractedImage[]> {
  console.log('Extracting images from page...');
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
  console.log(`Extracted ${images.length} images.`);
  return images;
}

export async function extractImagesFromURL(options: OpenPageOptions) {
  console.log(`Starting image extraction from URL: ${options.url}`);
  const { browser, page } = await openPage(options);
  console.log('Page has been opened.');
  const images = await extractImages(page);
  console.log('Closing browser session.');
  await browser.close();
  console.log('Browser has been closed.');
  return images;
}
