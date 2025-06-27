import { LinkedInPublic } from '../core/public';
import { Page } from 'puppeteer-core';
import { handleModal, scrollPageToBottom } from './articles';
import { JobSearchOptions } from './people';


export interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  description?: string;
  postedAt?: string;
}

/**
 * Forcefully removes common blocking elements like cookie banners and modals.
 * @param {Page} page The Puppeteer page object.
 */
async function forceCleanPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    const selectors = [
      '.artdeco-global-alert', // Global alerts
      '.artdeco-toast-item', // Toast notifications
      '#li-sdk-cookie-consent-banner', // Cookie consent banner
      '.modal__overlay', // General modal overlay
      '.artdeco-modal-overlay', // Another type of modal overlay
    ];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    }
  });
}

declare module '../core/public' {
  interface LinkedInPublic {
    searchJobs: (options: JobSearchOptions) => Promise<Job[]>;
  }
}

LinkedInPublic.prototype.searchJobs = async function (
  this: LinkedInPublic,
  options: JobSearchOptions,
): Promise<Job[]> {
  console.log('Starting job search with options:', options);
  if (!this.browser) {
    throw new Error('Browser not initialized. Call launch() first.');
  }

  const page = await this.browser.newPage();
  const keywords = encodeURIComponent(options.keywords);
  const location = encodeURIComponent(options.location);
  
  const jobsUrl = `https://www.linkedin.com/jobs/search?keywords=${keywords}&location=${location}`;
  console.log('Navigating to jobs URL:', jobsUrl);
  await page.goto(jobsUrl, { waitUntil: 'networkidle2' });

  console.log('Handling modal...');
  await handleModal(page);
  console.log('Forcing clean page...');
  await forceCleanPage(page);

  console.log('Waiting for job results selector...');
  await page.waitForSelector('ul.jobs-search__results-list', { timeout: 20000 });
  console.log('Job results selector found.');

  console.log('Scrolling page to bottom...');
  await scrollPageToBottom(page);
  console.log('Finished scrolling.');

  console.log('Evaluating page for job items...');
  const jobs = await page.evaluate(() => {
    const items: Job[] = [];
    document.querySelectorAll('ul.jobs-search__results-list > li').forEach((item) => {
      const title = item.querySelector('h3.base-search-card__title')?.textContent?.trim() ?? '';
      const company = item.querySelector('h4.base-search-card__subtitle')?.textContent?.trim() ?? '';
      const location = item.querySelector('span.job-search-card__location')?.textContent?.trim() ?? '';
      const url = item.querySelector('a.base-card__full-link')?.getAttribute('href') ?? '';
      const postedAt = item.querySelector('time.job-search-card__listdate')?.textContent?.trim() ?? '';

      if (title && url) {
        items.push({ title, company, location, url, postedAt });
      }
    });
    return items;
  });
  console.log(`Found ${jobs.length} jobs.`);
  await page.close();
  return jobs;
}; 