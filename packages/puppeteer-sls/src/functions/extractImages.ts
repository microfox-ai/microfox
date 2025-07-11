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

export async function extractBackgroundImages(
  page: Page,
): Promise<ExtractedImage[]> {
  console.log('Deep extracting background images from page...');
  const images = await page.evaluate(() => {
    const allImages: {
      src: string | null;
      srcset: string | null;
      responsiveImages: { url: string; size: string }[] | null;
      alt: string | null;
    }[] = [];
    const elements = document.querySelectorAll('a[href^="/jobs/"]');
    console.log(
      `Found ${elements.length} elements to scan for background images.`,
    );

    for (const element of Array.from(elements)) {
      let backgroundImage = (element as HTMLElement).style?.backgroundImage;

      if (!backgroundImage || backgroundImage === 'none') {
        backgroundImage = window
          .getComputedStyle(element)
          .getPropertyValue('background-image');
      }

      if (backgroundImage && backgroundImage !== 'none') {
        console.log(
          `Processing element ${element.tagName} with background-image: ${backgroundImage}`,
        );
        const imageSetRegex = /(-webkit-)?image-set\(([^)]+)\)/g;
        let imageSetMatch;
        let processedImageSet = false;

        while ((imageSetMatch = imageSetRegex.exec(backgroundImage)) !== null) {
          processedImageSet = true;
          const imageSetContent = imageSetMatch[2];
          if (imageSetContent) {
            const responsiveImages: { url: string; size: string }[] = [];
            const parts = imageSetContent.split(',');
            parts.forEach(part => {
              const trimmedPart = part.trim();
              const urlMatch = trimmedPart.match(/url\((['"]?)(.*?)\1\)/);
              const sizeMatch = trimmedPart.match(/\s+([\d.]+)x/);
              if (urlMatch && urlMatch[2]) {
                const url = urlMatch[2];
                if (url && !url.startsWith('data:')) {
                  responsiveImages.push({
                    url: url,
                    size: sizeMatch ? sizeMatch[1] + 'x' : '1x',
                  });
                }
              }
            });

            if (responsiveImages.length > 0) {
              allImages.push({
                src: responsiveImages[0]?.url || null,
                srcset: responsiveImages
                  .map(img => `${img.url} ${img.size}`)
                  .join(', '),
                responsiveImages: responsiveImages,
                alt: `Background image from ${element.tagName.toLowerCase()}`,
              });
            }
          }
        }

        if (processedImageSet) {
          continue;
        }

        const urlRegex = /url\((['"]?)(.*?)\1\)/g;
        let urlMatch;
        while ((urlMatch = urlRegex.exec(backgroundImage)) !== null) {
          const url = urlMatch[2].trim();
          if (url && !url.startsWith('data:')) {
            if (
              !allImages.some(
                img =>
                  img.src === url ||
                  (img.responsiveImages &&
                    img.responsiveImages.some(r => r.url === url)),
              )
            ) {
              allImages.push({
                src: url,
                srcset: null,
                responsiveImages: null,
                alt: `Background image from ${element.tagName.toLowerCase()}`,
              });
            }
          }
        }
      }
    }
    return allImages;
  });

  console.log(`Deep extracted ${images.length} background images.`);
  return images;
}

export async function extractImagesFromURL(
  options: OpenPageOptions & {
    deepExtract?: boolean;
  },
) {
  console.log(`Starting image extraction from URL: ${options.url}`);
  const { browser, page } = await openPage(options);
  console.log('Page has been opened.');

  if (options.deepExtract) {
    console.log('Scrolling page to trigger lazy loading...');
    await page.evaluate(async () => {
      const scrollableElement =
        document.getElementById('pageScroll') || document.body;
      await new Promise<void>(resolve => {
        let lastHeight = -1;
        let steadyCount = 0;
        let totalScrolls = 0;
        const maxSteadyCount = 3;
        const maxScrolls = 30; // limit to avoid infinite scroll
        const timer = setInterval(() => {
          totalScrolls++;
          const newHeight = scrollableElement.scrollHeight;
          if (newHeight === lastHeight) {
            steadyCount++;
          } else {
            steadyCount = 0; // reset if new content loaded
          }

          if (steadyCount >= maxSteadyCount || totalScrolls >= maxScrolls) {
            clearInterval(timer);
            resolve();
            return;
          }

          scrollableElement.scrollTo(0, newHeight);
          lastHeight = newHeight;
        }, 500);
      });
    });
    console.log(
      'Finished scrolling. Waiting for 5 seconds for content to load...',
    );
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  let images = await extractImages(page);
  if (options.deepExtract) {
    const backgroundImages = await extractBackgroundImages(page);
    images = images.concat(backgroundImages);
  }
  console.log('Closing browser session.');
  await browser.close();
  console.log('Browser has been closed.');
  return images;
}
