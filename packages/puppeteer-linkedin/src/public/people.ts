import { LinkedInPublic } from '../core/public';
import { Page } from 'puppeteer-core';
import { handleModal, scrollPageToBottom } from './articles';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Represents a person's profile as found in a public search.
 */
export interface Person {
  /** The full name of the person. */
  name: string;
  /** The person's professional headline. */
  headline: string;
  /** The URL of the person's public profile. */
  profileUrl: string;
  /** The URL of the person's profile picture. */
  imageUrl?: string;
  /** The person's location. */
  location?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * The type of search to perform.
 * - 'PEOPLE': Search for people.
 * - 'JOBS': Search for jobs.
 * - 'LEARNING': Search for learning content.
 */
export type SearchType = 'PEOPLE' | 'JOBS' | 'LEARNING';

/**
 * Options for searching people.
 */
export interface PeopleSearchOptions {
  firstName?: string;
  lastName?: string;
}

/**
 * Options for searching jobs.
 */
export interface JobSearchOptions {
  keywords: string;
  location: string;
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

export interface Experience {
  title: string;
  company: string;
  dateRange: string;
  location: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  dateRange: string;
}

export interface PersonProfile extends Person {
  about?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
}

declare module '../core/public' {
  interface LinkedInPublic {
    searchPeople: (options: PeopleSearchOptions) => Promise<Person[]>;
    getProfile: (profileUrl: string) => Promise<PersonProfile>;
  }
}

LinkedInPublic.prototype.searchPeople = async function (
  this: LinkedInPublic,
  options: PeopleSearchOptions,
): Promise<Person[]> {
  if (!this.page) {
    throw new Error('Page not initialized. Call launch() first.');
  }
  const page = this.page;

  // 1. Navigate from Home
  const homeUrl = 'https://www.linkedin.com/';
  await page.goto(homeUrl, { waitUntil: 'networkidle2' });

  await handleModal(page);
  await forceCleanPage(page);

  // 2. Click the 'People' link to go to the search directory
  const linkClicked = await page.$$eval(
    'a',
    (links, searchText) => {
      const link = Array.from(links).find(
        (a) => a.textContent?.trim() === searchText,
      );
      if (link) {
        (link as HTMLElement).click();
        return true;
      }
      return false;
    },
    'People',
  );

  if (!linkClicked) {
    throw new Error("Could not find 'People' link on the homepage.");
  }

  // 3. Wait for the public directory page to load
  await page.waitForFunction(
    () => window.location.href.includes('/pub/dir'),
    { timeout: 15000 },
  );

  await handleModal(page);
  await forceCleanPage(page);

  // 4. Find the search form (or click placeholder to reveal it)
  const firstNameInputSelector = 'input[name="firstName"]';
  const isInputVisible = await page
    .waitForSelector(firstNameInputSelector, { visible: true, timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!isInputVisible) {
    const placeholderSelector = 'button.search-bar__placeholder';
    await page.waitForSelector(placeholderSelector, { visible: true });
    await page.click(placeholderSelector);
    await page.waitForSelector(firstNameInputSelector, { visible: true });
  }

  // 5. Fill form and submit
  const { firstName, lastName } = options;
  if (firstName) {
    await page.type(firstNameInputSelector, firstName, { delay: 50 });
  }
  if (lastName) {
    await page.type('input[name="lastName"]', lastName, { delay: 50 });
  }
  const form = await page.waitForSelector(
    '.base-search-bar[data-searchbar-type="PEOPLE"] form',
  );
  if (!form) throw new Error('Could not find people search form.');
  await form.evaluate((f: HTMLFormElement) => f.submit());
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // 6. Scrape results from the current page
  await page.waitForSelector('li.pserp-layout__profile-result-list-item', {
    timeout: 10000,
  });

  const allPeople: Person[] = [];

  while (true) {
    await scrollPageToBottom(page);

    const peopleOnPage = await page.$$eval(
      'li.pserp-layout__profile-result-list-item',
      (items) =>
        items.map((item): Person | null => {
          const card = item.querySelector('a.base-card');
          if (!card) return null;

          const nameElement = item.querySelector('h3.base-search-card__title');
          const headlineElement = item.querySelector(
            'h4.base-search-card__subtitle',
          );
          const locationElement = item.querySelector(
            'p.people-search-card__location',
          );
          const imageElement = item.querySelector('img.artdeco-entity-image');

          return {
            profileUrl: (card as HTMLAnchorElement).href,
            name: nameElement ? nameElement.textContent?.trim() ?? '' : '',
            headline: headlineElement
              ? headlineElement.textContent?.trim() ?? ''
              : '',
            location: locationElement
              ? locationElement.textContent?.trim() ?? ''
              : '',
            imageUrl: imageElement
              ? (imageElement as HTMLImageElement).src
              : undefined,
          };
        }),
    );

    allPeople.push(...peopleOnPage.filter((p): p is Person => p !== null));

    const nextButton = await page.$('button[aria-label="Next"]');
    if (!nextButton) {
      break;
    }

    const isDisabled = await nextButton.evaluate((btn) => btn.disabled);
    if (isDisabled) {
      break;
    }

    await nextButton.click();
    await Promise.race([
      page.waitForSelector('li.pserp-layout__profile-result-list-item'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
  }

  return allPeople;
};

LinkedInPublic.prototype.getProfile = async function (
  this: LinkedInPublic,
  profileUrl: string,
): Promise<PersonProfile> {
  if (!this.browser) {
    throw new Error('Browser not initialized. Call launch() first.');
  }
  const page = await this.browser.newPage();
  await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });
  await forceCleanPage(page);

  const profile = await page.evaluate((): PersonProfile => {
    interface Experience {
      title: string;
      company: string;
      dateRange: string;
      location: string;
      description: string;
    }

    interface Education {
      school: string;
      degree: string;
      dateRange: string;
    }

    interface Person {
      name: string;
      headline: string;
      profileUrl: string;
      imageUrl?: string;
      location?: string;
      firstName?: string;
      lastName?: string;
    }

    interface PersonProfile extends Person {
      about?: string;
      experience?: Experience[];
      education?: Education[];
      skills?: string[];
    }

    const getText = (selector: string, element: Document | Element = document): string | undefined => {
      return element.querySelector(selector)?.textContent?.trim() || undefined;
    };

    const name = getText('h1.top-card-layout__title');
    const headline = getText('h2.top-card-layout__headline');
    const location = getText('.top-card-layout__first-subline > div > span');
    const about = getText('section[data-section="summary"] p');

    const experienceNodes = document.querySelectorAll('section[data-section="experience"] li.profile-section-card');
    const experience: Experience[] = Array.from(experienceNodes).map((node): Experience => {
      const dateRangeText = getText('.date-range', node);
      return {
        title: getText('.experience-item__title', node) || '',
        company: getText('.experience-item__subtitle', node) || '',
        dateRange: dateRangeText ? dateRangeText.replace(/\\s+/g, ' ').trim() : '',
        location: getText('.experience-item__meta-item', node) || '',
        description: getText('.show-more-less-text__text--less', node) || '',
      };
    });

    const educationNodes = document.querySelectorAll('section[data-section="education"] li.profile-section-card');
    const education: Education[] = Array.from(educationNodes).map((node): Education => ({
      school: getText('h3.profile-section-card__title', node) || '',
      degree: getText('.profile-section-card__subtitle span[aria-hidden="true"]', node) || '',
      dateRange: getText('.date-range span[aria-hidden="true"]', node) || '',
    }));
    
    const skillsNodes = document.querySelectorAll('section[data-section="skills"] li.skills-section__item');
    const skills: string[] = Array.from(skillsNodes).map(node => getText('.skills-section__skill-name', node) || '');

    const result: PersonProfile = {
      name: name || '',
      headline: headline || '',
      location: location,
      profileUrl: window.location.href,
      about: about,
      experience: experience,
      education: education,
      skills: skills,
    };
    return result;
  });

  await page.close();
  return profile;
};
