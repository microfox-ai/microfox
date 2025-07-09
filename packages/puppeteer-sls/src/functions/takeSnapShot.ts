import { S3Space, S3SpaceConfig } from '@microfox/s3-space';
import { openPage, OpenPageOptions } from './openPage';

/**
 * Options for taking a screenshot.
 */
export interface TakeSnapShotOptions extends OpenPageOptions {
  /**
   * The file name for the screenshot.
   */
  fileName: string;
  /**
   * The quality of the screenshot. Only for jpeg.
   * @default 100
   */
  quality?: number;
  /**
   * The encoding of the screenshot.
   * @default 'binary'
   */
  encoding?: 'base64' | 'binary';
  /**
   * S3 configuration for uploading the screenshot.
   */
  s3Config: S3SpaceConfig;
}

/**
 * Opens a page and takes a screenshot, uploads it to S3 and returns public URL.
 *
 * @param options - The options for taking the screenshot.
 * @returns A promise that resolves with the public URL of the screenshot.
 */
export async function takeSnapShot(
  options: TakeSnapShotOptions,
): Promise<string | undefined> {
  const { browser, page } = await openPage(options);
  const screenshotBuffer = await page.screenshot({
    quality: options.quality,
    encoding: options.encoding || 'binary',
    type: options.quality ? 'jpeg' : 'png',
  });
  await browser.close();

  const s3 = new S3Space(options.s3Config);
  const fileInfo = {
    fileName: options.fileName,
    fileType: options.quality ? 'image/jpeg' : 'image/png',
    fileBuffer: screenshotBuffer,
  };
  await s3.uploadFile({
    fileInfoWithFileBuffer: fileInfo,
  });

  return s3.getPublicFileUrl({
    file: fileInfo,
  });
}
