import { Page } from 'puppeteer-core';
import { _autoScroll } from '../utils/scrolling';

type EnsureLoggedIn = () => Promise<void>;
type GetPage = () => Page | null;

export class LinkedInJobs {
  private ensureLoggedIn: EnsureLoggedIn;
  private getPage: GetPage;

  protected get page(): Page | null {
    return this.getPage();
  }

  constructor(ensureLoggedIn: EnsureLoggedIn, getPage: GetPage) {
    this.ensureLoggedIn = ensureLoggedIn;
    this.getPage = getPage;
  }

  async getRecommendedJobs(limit = 10) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log('Navigating to recommended jobs page...');
    await this.page.goto('https://www.linkedin.com/jobs/recommender/recommended-jobs/', { waitUntil: 'domcontentloaded' });

    try {
      const jobListSelector = '.jobs-recommender__job-listings-container';
      console.log('Waiting for job listings to load...');
      await this.page.waitForSelector(jobListSelector, { timeout: 15000 });

      console.log('Scraping recommended jobs...');
      const jobs = await this.page.evaluate((limit) => {
        const jobElements = Array.from(document.querySelectorAll('.job-card-container'));
        const jobData = [];
        for (let i = 0; i < Math.min(jobElements.length, limit); i++) {
          const el = jobElements[i];
          const title = (el.querySelector('.job-card-list__title') as HTMLElement)?.innerText || 'TBD';
          const company = (el.querySelector('.job-card-container__primary-description') as HTMLElement)?.innerText || 'TBD';
          const location = (el.querySelector('.job-card-container__metadata-item') as HTMLElement)?.innerText || 'TBD';
          const link = (el.querySelector('a.job-card-list__title') as HTMLAnchorElement)?.href || 'TBD';
          jobData.push({ title, company, location, link });
        }
        return jobData;
      }, limit);

      return jobs;
    } catch (error) {
      console.error('Failed to get recommended jobs. Saving screenshot to recommended-jobs-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'recommended-jobs-failure.png' });
      }
      throw new Error(`Could not get recommended jobs: ${(error as Error).message}`);
    }
  }

  async searchJobs(options: { keywords: string; location: string }, limit = 10) {
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    const { keywords, location } = options;
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;
    console.log(`Navigating to job search page: ${searchUrl}`);
    await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    const jobListSelector = '.jobs-search-results-list';
    console.log('Waiting for job list to load...');
    await this.page.waitForSelector(jobListSelector, { timeout: 15000 });
    
    console.log('Scrolling to load all search results...');
    await this.page.evaluate(async (selector) => {
      const element = document.querySelector(selector);
      if (!element) return;
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = element.scrollHeight;
          element.scrollTop += distance;
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    }, jobListSelector);

    const jobCardSelector = '.scaffold-layout__list-container li.jobs-search-results__list-item';
    const jobCards = await this.page.$$(jobCardSelector);
    const jobs = [];

    console.log(`Found ${jobCards.length} jobs in search. Scraping details for the first ${limit}...`);

    for (let i = 0; i < Math.min(jobCards.length, limit); i++) {
      try {
        const card = jobCards[i];
        const cardTitle = await card.$eval('.job-card-list__title', (el) => (el as HTMLElement).innerText.trim());

        await card.click();

        await this.page.waitForFunction(
          (title) => {
            const detailTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.textContent?.trim();
            return detailTitle?.includes(title);
          },
          { timeout: 10000 },
          cardTitle
        );

        console.log(`Scraping job ${i + 1}/${limit}: ${cardTitle}`);
        
        const job = await this.page.evaluate(() => {
          const getText = (selector: string) => (document.querySelector(selector) as HTMLElement)?.innerText.trim() || null;
          
          const title = getText('.job-details-jobs-unified-top-card__job-title');
          const company = getText('a.job-details-jobs-unified-top-card__company-name');
          const location = getText('.job-details-jobs-unified-top-card__primary-description-container > div');
          const description = getText('.jobs-description-content__text');
          const applicantCount = getText('.jobs-unified-top-card__applicant-count');
          const url = (document.querySelector('.job-details-jobs-unified-top-card__job-title a') as HTMLAnchorElement)?.href || window.location.href;

          return { title, company, location, description, applicantCount, url };
        });

        jobs.push(job);

      } catch (error) {
        console.error(`Failed to scrape job from search ${i + 1}: ${(error as Error).message}`);
      }
    }

    return jobs;
  }

  // Placeholder for future job-related authenticated methods
} 