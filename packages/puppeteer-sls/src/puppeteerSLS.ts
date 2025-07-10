import { extractImagesFromURL } from './functions/extractImages';
import { extractLinks, extractLinksFromUrl } from './functions/extractLinks';
import { extractWebpage } from './functions/extractWebpage';
import { openPage } from './functions/openPage';
import { takeSnapShot } from './functions/takeSnapShot';

export const PuppeteerSLS = {
  extractImagesFromURL,
  extractLinksFromUrl,
  extractWebpage,
  openPage,
  takeSnapShot,
};
