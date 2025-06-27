import { Page } from 'puppeteer-core';
import { _autoScroll } from '../utils/scrolling';

type EnsureLoggedIn = () => Promise<void>;
type GetPage = () => Page | null;

export class LinkedInSearch {
  private ensureLoggedIn: EnsureLoggedIn;
  private getPage: GetPage;

  protected get page(): Page | null {
    return this.getPage();
  }

  constructor(ensureLoggedIn: EnsureLoggedIn, getPage: GetPage) {
    this.ensureLoggedIn = ensureLoggedIn;
    this.getPage = getPage;
  }

  async search(query: string, category: 'people' | 'jobs' | 'companies' | 'groups' | 'posts' | 'events' | 'products' | 'services' | 'schools') {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    const searchUrl = `https://www.linkedin.com/search/results/${category}/?keywords=${encodeURIComponent(query)}`;
    console.log(`Navigating to search page: ${searchUrl}`);
    await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    try {
      const resultsContainerSelector = '.search-results-container';
      console.log('Waiting for search results to load...');
      await this.page.waitForSelector(resultsContainerSelector, { timeout: 15000 });

      // Generic scraper, can be customized for each category
      const results = await this.page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.reusable-search__result-container'));
        return items.map(item => {
          const titleElement = item.querySelector('.entity-result__title-text a');
          const title = titleElement ? (titleElement as HTMLElement).innerText.trim() : 'TBD';
          const link = titleElement ? (titleElement as HTMLAnchorElement).href : 'TBD';
          const summary = (item.querySelector('.entity-result__summary') as HTMLElement)?.innerText.trim() || '';
          return { title, link, summary };
        });
      });

      return results;
    } catch (error) {
      console.error('Failed to perform search. Saving screenshot to search-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'search-failure.png' });
      }
      throw new Error(`Could not perform search: ${(error as Error).message}`);
    }
  }

  private async scrapePeople() {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const results: { name: string; headline: string; profileUrl: string; }[] = [];
      const resultElements = document.querySelectorAll('li.reusable-search__result-container');

      resultElements.forEach(element => {
        const nameElement = (element.querySelector('span[aria-hidden="true"]') as HTMLElement);
        const anchorElement = element.querySelector('a.app-aware-link') as HTMLAnchorElement;

        if (nameElement && anchorElement) {
          const name = nameElement.innerText;
          const profileUrl = anchorElement.href;
          const headlineElement = (element.querySelector('.entity-result__primary-subtitle') as HTMLElement);
          const headline = headlineElement ? headlineElement.innerText : '';
          
          results.push({ name, headline, profileUrl });
        }
      });

      return results;
    });
  }

  private async scrapeJobs() {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const results: { title: string; company: string; location: string; url: string; }[] = [];
      document.querySelectorAll('li.reusable-search__result-container').forEach(element => {
        const jobCard = element.querySelector('.job-card-container');
        if (jobCard) {
          const titleElement = (jobCard.querySelector('.job-card-list__title') as HTMLAnchorElement);
          const title = titleElement ? titleElement.innerText.trim() : '';
          const url = titleElement ? titleElement.href : '';
          const company = (jobCard.querySelector('.job-card-container__primary-description') as HTMLElement)?.innerText.trim() || '';
          const location = (jobCard.querySelector('.job-card-container__metadata-item') as HTMLElement)?.innerText.trim() || '';
          
          if(title && url && company) {
            results.push({ title, company, location, url });
          }
        }
      });
      return results;
    });
  }

  private async scrapePosts() {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const results: { author: string; text: string; postUrl: string; }[] = [];
      document.querySelectorAll('div.update-components-update-v2').forEach(element => {
        const actorElement = element.querySelector('.update-components-actor');
        if (!actorElement) return;

        const author = (actorElement.querySelector('.update-components-actor__name span[aria-hidden="true"]') as HTMLElement)?.innerText.trim();
        const postLinkElement = (actorElement.querySelector('a.app-aware-link') as HTMLAnchorElement);
        const postUrl = postLinkElement?.href || '';
        const textContent = (element.querySelector('.update-components-text span') as HTMLElement)?.innerText.trim();

        if (author && textContent && postUrl) {
            results.push({ author, text: textContent, postUrl });
        }
      });
      return results;
    });
  }

  private async scrapeGroups() {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    return this.page.evaluate(() => {
      const results: { name: string; members: string; groupUrl: string; }[] = [];
      document.querySelectorAll('li.reusable-search__result-container').forEach(element => {
        const groupLinkElement = element.querySelector('a[href*="/groups/"]') as HTMLAnchorElement;
        if (groupLinkElement) {
          const nameElement = (element.querySelector('.entity-result__title-text') as HTMLElement);
          const name = nameElement ? nameElement.innerText.trim() : '';
          const membersElement = (element.querySelector('.entity-result__secondary-subtitle') as HTMLElement);
          const members = membersElement ? membersElement.innerText.trim() : '';
          const groupUrl = groupLinkElement.href;
          if (name && groupUrl) {
            results.push({ name, members, groupUrl });
          }
        }
      });
      return results;
    });
  }
} 