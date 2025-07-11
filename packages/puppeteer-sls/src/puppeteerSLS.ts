import { extractImagesFromURL } from './functions/extractImages';
import { extractLinks, extractLinksFromUrl } from './functions/extractLinks';
import { extractWebpage } from './functions/extractWebpage';
import { openPage } from './functions/openPage';
import { takeSnapShot } from './functions/takeSnapShot';

/**
 * @description PuppeteerSLS is a class that provides a set of functions for running Puppeteer on serverless functions.
 * every instance starts from a new browser instance.
 * @example
 * ```ts
 * const puppeteerSLS = new PuppeteerSLS();
 * const images = await puppeteerSLS.extractImagesFromURL('https://www.google.com');
 * ```
 */
export const PuppeteerSLS = {
  extractImagesFromURL,
  extractLinksFromUrl,
  extractWebpage,
  openPage,
  takeSnapShot,
};
