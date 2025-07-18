import { Page } from 'puppeteer-core';
import { openPage, OpenPageOptions } from './openPage';
import { extractPaletteFromImageData, ExtractedPalette } from './colorExtract';

export interface AccessibilityInfo {
  color: string;
  contrastRatio: number;
}
export interface ExtractedImage {
  src: string | null;
  srcset: string | null;
  responsiveImages: { url: string; size: string }[] | null;
  alt: string | null;
  imgPermalink: string | null;
  pagePermalink: string;
  width: number | null;
  height: number | null;
  dominantColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  accessibility?: AccessibilityInfo | null;
  palette?: string[] | null;
  colorExtractionLogs?: string[];
}

export async function extractImages(
  page: Page,
  options?: { enableColorExtraction?: boolean },
): Promise<ExtractedImage[]> {
  console.log('Extracting images from page...');
  const pageUrl = page.url();
  const enableColorExtraction = options?.enableColorExtraction;
  // Convert the function to a string to pass it into the browser context reliably.
  const extractPaletteFnString = extractPaletteFromImageData.toString();

  const images = await page.$$eval(
    'img',
    (
      imgs: HTMLImageElement[],
      pageUrl: string,
      enableColorExtraction: boolean,
      _extractPaletteString: string,
    ) => {
      // Reconstruct the function inside the browser context from the string.
      const _extractPalette = new Function(
        `return ${_extractPaletteString}`,
      )() as (imageData: Uint8ClampedArray) => ExtractedPalette;

      return imgs.map((img: HTMLImageElement) => {
        let palette: string[] | undefined = undefined;
        let dominantColor: string | undefined = undefined;
        let secondaryColor: string | undefined = undefined;
        let accentColor: string | undefined = undefined;
        let accessibility: AccessibilityInfo | undefined = undefined;
        const logs: string[] = [];
        if (enableColorExtraction) {
          logs.push(`Color extraction enabled for image: ${img.src}`);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            if (canvas.width && canvas.height) {
              logs.push(
                `Created canvas with dimensions: ${canvas.width}x${canvas.height}`,
              );
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(
                  0,
                  0,
                  canvas.width,
                  canvas.height,
                ).data;
                const result = _extractPalette(imageData);
                palette = result.palette;
                dominantColor = result.dominantColor;
                secondaryColor = result.secondaryColor;
                accentColor = result.accentColor;
                accessibility = result.accessibility;
                if (result.logs) {
                  logs.push(...result.logs);
                }
              } else {
                logs.push('Failed to get 2D context from canvas.');
              }
            } else {
              logs.push(
                `Skipping color extraction: Invalid image dimensions (${img.naturalWidth}x${img.naturalHeight})`,
              );
            }
          } catch (e: any) {
            logs.push(
              `ERROR during canvas operations: ${e.message || 'Unknown error'}`,
            );
          }
        }
        const parentAnchor = img.closest('a');
        const imgPermalink = parentAnchor ? parentAnchor.href : pageUrl;
        const result: any = {
          src: img.getAttribute('src'),
          srcset: img.getAttribute('srcset'),
          responsiveImages:
            img
              .getAttribute('srcset')
              ?.split(',')
              .map(src => {
                const trimmedSrc = src.trim();
                if (!trimmedSrc) {
                  return null;
                }
                const parts = trimmedSrc.split(/\s+/);
                const url = parts[0];
                const size = parts.length > 1 ? parts[1] : '';
                if (!url) {
                  return null;
                }
                return { url, size };
              })
              .filter(
                (item): item is { url: string; size: string } => item !== null,
              ) || null,
          alt: img.getAttribute('alt'),
          imgPermalink: imgPermalink,
          pagePermalink: pageUrl,
          width: img.width || null,
          height: img.height || null,
        };
        if (enableColorExtraction) {
          result.dominantColor = dominantColor || null;
          result.secondaryColor = secondaryColor || null;
          result.accentColor = accentColor || null;
          result.accessibility = accessibility || null;
          result.palette = palette || null;
          result.colorExtractionLogs = logs;
        }
        return result;
      });
    },
    pageUrl,
    Boolean(enableColorExtraction),
    extractPaletteFnString,
  );
  console.log(`Extracted ${images.length} images.`);
  return images;
}

export async function extractBackgroundImages(
  page: Page,
): Promise<ExtractedImage[]> {
  console.log('Deep extracting background images from page...');
  const pageUrl = page.url();
  const images = await page.evaluate(pageUrl => {
    const allImages: ExtractedImage[] = [];
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
        const anchor = (element as HTMLElement).closest('a');
        const imgPermalink = anchor ? anchor.href : pageUrl;
        const width = (element as HTMLElement).clientWidth;
        const height = (element as HTMLElement).clientHeight;
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
                imgPermalink: imgPermalink,
                pagePermalink: pageUrl,
                width,
                height,
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
                imgPermalink: imgPermalink,
                pagePermalink: pageUrl,
                width,
                height,
              });
            }
          }
        }
      }
    }
    return allImages;
  }, pageUrl);

  console.log(`Deep extracted ${images.length} background images.`);
  return images;
}

export async function extractImagesFromURL(
  options: OpenPageOptions & {
    deepExtract?: boolean;
    enableColorExtraction?: boolean;
  },
) {
  try {
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
    let images = await extractImages(page, {
      enableColorExtraction: options.enableColorExtraction,
    });
    if (options.deepExtract) {
      const backgroundImages = await extractBackgroundImages(page);
      images = images.concat(backgroundImages);
    }
    // Log the results for debugging
    images.forEach(img => {
      if (img.colorExtractionLogs && img.colorExtractionLogs.length > 0) {
        console.log(`--- Logs for image: ${img.src} ---`);
        img.colorExtractionLogs.forEach(log => console.log(log));
        console.log('--- End of logs ---');
      }
    });
    console.log('Closing browser session.');
    await browser.close();
    console.log('Browser has been closed.');
    return images;
  } catch (error) {
    console.error('Error extracting images:', error);
    throw error;
  }
}
