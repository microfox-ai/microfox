import { Page } from 'puppeteer-core';
import { openPage, OpenPageOptions } from './openPage';

export interface ExtractedVideo {
  src: string | null;
  sources: { src: string; type: string | null }[] | null;
  poster: string | null;
  videoPermalink: string | null;
  pagePermalink: string;
  width: number | null;
  height: number | null;
}

export async function extractVideos(page: Page): Promise<ExtractedVideo[]> {
  console.log('Extracting videos from page...');
  const pageUrl = page.url();
  const videos = await page.$$eval(
    'video',
    (videos: HTMLVideoElement[], pageUrl: string) =>
      videos.map((video: HTMLVideoElement) => {
        const parentAnchor = video.closest('a');
        const videoPermalink = parentAnchor ? parentAnchor.href : pageUrl;

        const sourceElements = Array.from(video.querySelectorAll('source'));
        const sources =
          sourceElements.length > 0
            ? sourceElements.map(source => ({
                src: source.src,
                type: source.getAttribute('type'),
              }))
            : null;

        return {
          src: video.getAttribute('src'),
          sources: sources,
          poster: video.getAttribute('poster'),
          videoPermalink: videoPermalink,
          pagePermalink: pageUrl,
          width: video.videoWidth || video.width || null,
          height: video.videoHeight || video.height || null,
        };
      }),
    pageUrl,
  );
  console.log(`Extracted ${videos.length} videos.`);
  return videos;
}

export async function extractVideosFromURL(
  options: OpenPageOptions & {
    deepExtract?: boolean;
  },
) {
  try {
    console.log(`Starting video extraction from URL: ${options.url}`);
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

    const videos = await extractVideos(page);

    console.log('Closing browser session.');
    await browser.close();
    console.log('Browser has been closed.');
    return videos;
  } catch (error) {
    console.error('Error extracting videos:', error);
    throw error;
  }
}
