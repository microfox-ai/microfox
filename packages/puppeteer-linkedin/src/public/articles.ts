import { LinkedInPublic } from '../core/public';
import { delay } from '../utils/index';
import { ElementHandle, Page } from 'puppeteer-core';

// --- Start of new lower-level scraping functions ---

async function scrapeCollaborativeArticleSummary(
  card: ElementHandle,
): Promise<CollaborativeArticleSummary | null> {
  return card.evaluate((c) => {
    const linkElement = c.querySelector('a');
    if (!linkElement) return null;

    const titleElement = c.querySelector('h2');
    // This selector works for both the main feed and topic pages
    const topicElements = c.querySelectorAll(
      'a.tagged-topic, .content-hub-tagged-topics a',
    );

    const title = titleElement?.innerText.trim() ?? '';
    const url = linkElement.href;
    const topics = Array.from(topicElements).map((el) => ({
      name: el.textContent?.trim() ?? '',
      url: (el as HTMLAnchorElement).href,
    }));

    if (title && url) {
      return { title, url, topics };
    }
    return null;
  });
}

async function scrapePerspective(
  contribution: ElementHandle,
): Promise<Perspective | null> {
  return contribution.evaluate((c) => {
    const authorName =
      c.querySelector('.contribution-author__name')?.textContent?.trim() ?? '';
    const headline =
      c.querySelector('.contribution-author__headline')?.textContent?.trim() ??
      '';
    const text = c.querySelector('.contribution-text')?.textContent?.trim() ?? '';
    const likesText =
      c
        .querySelector('[data-test-id="social-actions__reactions"]')
        ?.getAttribute('data-num-reactions') ?? '0';
    const likes = parseInt(likesText, 10);

    // Skip if it's a "Show more" button or similar non-content item
    if (!authorName) {
      return null;
    }

    return {
      author: {
        name: authorName,
        headline,
      },
      text,
      likes,
    };
  });
}

export async function scrapeArticleSection(
  segment: ElementHandle,
): Promise<ArticleSection | null> {
  const section: ArticleSection | null = await segment.evaluate((s) => {
    const sectionTitle =
      s.querySelector('h2 > span:last-of-type')?.textContent?.trim() ??
      s.querySelector('h2')?.textContent?.trim() ??
      '';
    const content =
      s.querySelector('.article-main__content p')?.textContent?.trim() ?? '';

    if (!sectionTitle) return null;

    return { title: sectionTitle, content, perspectives: [] };
  });

  if (!section) return null;

  const perspectiveElements = await segment.$$('li.contribution-list-item');
  const perspectives: Perspective[] = [];

  for (const el of perspectiveElements) {
    // Check for and click a "show more" button within the list item itself
    const showMoreButton = await el.$('button:not([aria-label])'); // A generic button selector
    if (showMoreButton) {
      try {
        await showMoreButton.click();
        await delay(500); // Wait for content to load
      } catch (e) {
        // Ignore errors if button is not clickable
      }
    }
    const p = await scrapePerspective(el);
    if (p) {
      perspectives.push(p);
    }
  }

  section.perspectives = perspectives;

  return section;
}

// --- End of new lower-level scraping functions ---

export interface Perspective {
  author: {
    name: string;
    headline: string;
  };
  text: string;
  likes: number;
}

export interface ArticleSection {
  title: string;
  content: string;
  perspectives: Perspective[];
}

export interface CollaborativeArticleSummary {
  title: string;
  url: string;
  topics: { name: string; url: string }[];
}

export interface FullArticle extends CollaborativeArticleSummary {
  sections: ArticleSection[];
}

export interface MoreToExploreTopic {
  title: string;
  url: string;
  articles: CollaborativeArticleSummary[];
}

/**
 * Retries a function with exponential backoff.
 * @param {() => Promise<T>} fn The function to retry.
 * @param {number} maxRetries The maximum number of retries.
 * @param {number} wait The initial delay in milliseconds.
 * @returns {Promise<T>}
 * @template T
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  wait = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i < maxRetries - 1) {
        await delay(wait * 2 ** i);
      } else {
        throw e;
      }
    }
  }
  throw new Error('Retry failed');
}

/**
 * @param {Page} page - The Puppeteer page object.
 * @returns {Promise<void>}
 */
export async function handleModal(page: Page): Promise<void> {
  try {
    const modalSelector = '.modal__overlay';
    const modalVisible = await page.$(modalSelector);
    if (modalVisible) {
      // Click near the top-left corner to dismiss the modal by clicking the overlay
      await page.mouse.click(10, 10, { delay: 50 });
      await delay(1000); // Wait for modal to close
    }
    await page.waitForFunction(
      () => !document.querySelector('.modal__overlay'),
      { timeout: 5000 },
    );
  } catch (error) {
    // Modal did not appear or was already gone, which is fine.
  }
}

export async function waitForUrl(
  page: Page,
  urlPart: string,
  timeout = 30000,
): Promise<void> {
  await page.waitForFunction(
    (part: string) => window.location.href.includes(part),
    { timeout },
    urlPart,
  );
}

/**
 * Scrolls the page to the bottom to trigger lazy loading of content.
 * @param {Page} page - The Puppeteer page object.
 * @returns {Promise<void>}
 */
export async function scrollPageToBottom(page: Page): Promise<void> {
  let lastHeight = await page.evaluate('document.body.scrollHeight');
  let newHeight;
  let scrollAttempts = 0;
  const maxAttempts = 10; // Increased from 3 to be more robust
  const scrollStep = 1000; // was 2000

  while (scrollAttempts < maxAttempts) {
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await delay(scrollStep); // Use a fixed delay for scrolling
    newHeight = await page.evaluate('document.body.scrollHeight');

    if (newHeight === lastHeight) {
      scrollAttempts++;
    } else {
      lastHeight = newHeight;
      scrollAttempts = 0; // Reset if new content loads
    }
  }
}

declare module '../core/public' {
  interface LinkedInPublic {
    getCollaborativeArticles: (options?: {
      limit?: number;
    }) => Promise<CollaborativeArticleSummary[]>;
    getFullCollaborativeArticles: (options?: {
      limit?: number;
    }) => Promise<FullArticle[]>;
    scrapeArticlePage: (
      articleSummary: CollaborativeArticleSummary,
    ) => Promise<FullArticle | null>;
    scrapeMoreToExplore: (options?: {
      topicLimit?: number;
    }) => Promise<MoreToExploreTopic[]>;
  }
}

LinkedInPublic.prototype.getCollaborativeArticles = async function (
  this: LinkedInPublic,
  options,
) {
  const { page } = this;
  if (!page) {
    throw new Error('Page not initialized');
  }

  await retry(async () => {
    await page.goto('https://www.linkedin.com/pulse/topics/home/', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('section.core-rail', { timeout: 15000 });
  });

  await delay(2000 + Math.random() * 2000);

  await handleModal(page);

  // Scroll to load more articles
  let previousHeight;
  let consecutiveNoChange = 0;
  for (let i = 0; i < 30; i++) {
    // scroll up to 30 times
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await delay(2000 + Math.random() * 2000); // longer, randomized delay
    const newHeight = await page.evaluate('document.body.scrollHeight');

    if (newHeight === previousHeight) {
      consecutiveNoChange++;
      if (consecutiveNoChange > 3) {
        // Stop after 4 consecutive scrolls with no new content
        break;
      }
    } else {
      consecutiveNoChange = 0; // Reset counter if new content is loaded
    }
  }

  const articleCardElements = await page.$$('.content-hub-entity-card-redesign');
  const articleSummaries: CollaborativeArticleSummary[] = [];
  for (const card of articleCardElements) {
    if (options?.limit && articleSummaries.length >= options.limit) break;
    const summary = await scrapeCollaborativeArticleSummary(card);
    if (summary) {
      articleSummaries.push(summary);
    }
  }

  return articleSummaries;
};

LinkedInPublic.prototype.getFullCollaborativeArticles = async function (
  this: LinkedInPublic,
  options,
) {
  const summaries = await this.getCollaborativeArticles(options);
  const fullArticles: FullArticle[] = [];

  for (const summary of summaries) {
    const fullArticle = await this.scrapeArticlePage(summary);
    if (fullArticle) {
      fullArticles.push(fullArticle);
    }
  }
  return fullArticles;
};

LinkedInPublic.prototype.scrapeArticlePage = async function (
  this: LinkedInPublic,
  articleSummary: CollaborativeArticleSummary,
): Promise<FullArticle | null> {
  const { page } = this;
  if (!page) {
    throw new Error('Page not initialized');
  }

  try {
    await page.goto(articleSummary.url, { waitUntil: 'domcontentloaded' });
    await delay(1500 + Math.random() * 1500);

    await handleModal(page);

    const segmentElements = await page.$$('.article-segment');
    const sections: ArticleSection[] = [];
    for (const segment of segmentElements) {
      const section = await scrapeArticleSection(segment);
      if (section) {
        sections.push(section);
      }
    }

    return {
      ...articleSummary,
      sections,
    };
  } catch (e) {
    console.error(`Failed to scrape article ${articleSummary.url}:`, e);
    return null;
  }
};

LinkedInPublic.prototype.scrapeMoreToExplore = async function (
  this: LinkedInPublic,
  options,
) {
  const { page } = this;
  if (!page) {
    throw new Error('Page not initialized');
  }
  // 1. Get a pool of topics from the main articles page
  const summaries = await this.getCollaborativeArticles({ limit: 50 }); // Get a good number of articles to find diverse topics
  const allTopics = summaries.flatMap((s) => s.topics);

  const uniqueTopics = Array.from(new Map(allTopics.map(item => [item.url, item])).values());

  const results: MoreToExploreTopic[] = [];
  const topicsToScrape = uniqueTopics.slice(
    0,
    options?.topicLimit ?? uniqueTopics.length,
  );

  // 2. Visit each topic page and scrape its articles
  for (const topic of topicsToScrape) {
    await page.goto(topic.url, { waitUntil: 'domcontentloaded' });
    await delay(1500 + Math.random() * 2500);
    await handleModal(page);

    try {
      await page.waitForFunction(
        "document.querySelectorAll('.content-hub-entity-card-redesign').length > 0",
        { timeout: 20000 },
      );
    } catch (e) {
      console.warn(`Could not find articles for topic "${topic.name}" at ${topic.url}`);
      continue; // Skip to next topic if no articles are found
    }

    const articleCardElements = await page.$$(
      '.content-hub-entity-card-redesign',
    );
    const articles: CollaborativeArticleSummary[] = [];
    for (const card of articleCardElements) {
      const summary = await scrapeCollaborativeArticleSummary(card);
      if (summary) {
        articles.push(summary);
      }
    }
    results.push({ title: topic.name, url: topic.url, articles });
  }

  return results;
}; 