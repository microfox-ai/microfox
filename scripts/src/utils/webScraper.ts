import puppeteer from 'puppeteer';
import { generateObject } from 'ai';
import { models } from '../ai/models';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { PackageInfo } from '../types';
import { updateResearchReport } from '../octokit/commentReports';
import { logUsage } from '../ai/usage/usageLogger';
// User agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
];

// Helper function to get random user agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Helper function to add random delay
async function randomDelay(min = 2000, max = 5000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Schema for link analysis
const LinkAnalysisSchema = z.object({
  documentationLinks: z
    .array(z.string())
    .describe('A full array of useful links for package creation.'),
  reason: z.string().describe('Reason why these links were selected'),
  setupInstructionsLink: z
    .string()
    .optional()
    .describe('Link to the setup instructions for the API'),
});

type LinkAnalysis = z.infer<typeof LinkAnalysisSchema>;

/**
 * Validate and normalize a URL
 */
function validateUrl(url: string): string {
  try {
    // Check if URL is properly formatted
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (error) {
    throw new Error(
      `Invalid URL: ${url}. Please provide a valid URL including the protocol (http:// or https://)`,
    );
  }
}

/**
 * Extract all links from a webpage using Puppeteer
 */
export async function extractLinks(
  url: string,
  packageDir: string,
): Promise<string[]> {
  const validatedUrl = validateUrl(url);

  await updateResearchReport(
    'extractLinks',
    {
      details: {
        status: 'in-progress',
        'Extracting Links from': validatedUrl,
      },
    },
    packageDir,
  );

  console.log(`🌐 Launching browser to extract links from ${validatedUrl}...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set random user agent
    await page.setUserAgent(getRandomUserAgent());

    // Set additional headers
    await page.setExtraHTTPHeaders({
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      DNT: '1',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
    });

    // Add random delay before navigation
    await randomDelay();

    await page.goto(validatedUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Extract all links from the page
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      return anchors
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => {
          // Filter out anchors, images, files, and empty links
          return (
            href &&
            !href.includes('#') &&
            !href.startsWith('javascript:') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            !href.endsWith('.jpg') &&
            !href.endsWith('.jpeg') &&
            !href.endsWith('.png') &&
            !href.endsWith('.gif') &&
            !href.endsWith('.svg') &&
            !href.endsWith('.pdf') &&
            !href.endsWith('.doc') &&
            !href.endsWith('.docx') &&
            !href.endsWith('.xls') &&
            !href.endsWith('.xlsx') &&
            !href.endsWith('.zip') &&
            !href.endsWith('.rar')
          );
        });
    });

    links.push(validatedUrl);

    // Remove duplicates and normalize URLs
    const uniqueLinks = [...new Set(links)].map(link => {
      try {
        const url = new URL(link);
        return url.toString();
      } catch (e) {
        return link;
      }
    });

    console.log(
      `✅ Extracted ${uniqueLinks.length} unique links from ${validatedUrl}`,
    );

    // Update research report
    await updateResearchReport(
      'extractLinks',
      {
        status: 'success',
        details: {
          'Total Links': uniqueLinks.length,
          'Base URL': validatedUrl,
        },
      },
      packageDir,
    );

    return uniqueLinks;
  } finally {
    await browser.close();
  }
}

/**
 * Analyze links to determine which ones are useful for package creation
 */
export async function analyzeLinks(
  links: string[],
  query: string,
  options: {
    isBaseUrl: boolean;
    url: string;
    packageDir: string;
  },
): Promise<string[]> {
  let newLinks = [...links];
  if (options.isBaseUrl) {
    newLinks = newLinks.filter(link => link.includes(options.url));
  }
  console.log(
    `🧠 Analyzing ${newLinks.length} links to find useful ones for "${query}"...`,
  );

  // Update research report
  await updateResearchReport(
    'analyzeLinks',
    {
      status: 'in-progress',
      details: {
        'Analyzing Links': newLinks.length,
      },
    },
    options.packageDir,
  );
  const { object: analysis, usage } = await generateObject({
    model: models.googleGeminiPro,
    schema: LinkAnalysisSchema,
    system: `
      You are a helpful assistant that analyzes links and determines which links are documentation related and are most useful for creating a package.
      You can also figure out the link to the setup instructions for the required API (only if needed).
    `,
    prompt: `
      Analyze these links and determine which ones are most useful for creating a package based on this query: "${query}"

      Links:
      ${newLinks.map((link, i) => `${i + 1}. ${link}`).join('\n')}
      
      Select all the links that contain:
      1. API documentation
      2. Authentication information
      3. Endpoint descriptions
      4. SDK examples
      5. Integration guides
      
      Exclude links that are:
      1. General marketing pages
      2. Blog posts unrelated to the API
      3. Social media links
      4. Support pages
      5. Pricing pages
      6. Any link from an external website
      7. i18n versions of the URL

      Return all the relevant links that will help in creating a comprehensive SDK.

      Setup instructions link (optional):
      Check if there exists a link that better describes the setup instructions for the required API.
    `,
    temperature: 0.5,
  });

  logUsage(models.googleGeminiPro.modelId, usage);

  console.log(usage);

  console.log(
    `✅ Selected ${analysis.documentationLinks.length} useful links: ${analysis.reason}`,
  );

  const packageBuilderFile = path.join(
    options.packageDir,
    'package-builder.json',
  );
  const packageBuilderJson = JSON.parse(
    fs.readFileSync(packageBuilderFile, 'utf8'),
  );
  packageBuilderJson.allLinks = links;
  packageBuilderJson.filteredLinks = newLinks;
  packageBuilderJson.linkAnalysis = analysis;
  packageBuilderJson.linksUpdatedAt = new Date().toISOString();
  fs.writeFileSync(
    packageBuilderFile,
    JSON.stringify(packageBuilderJson, null, 2),
  );

  if (analysis.setupInstructionsLink) {
    const packageInfoFile = path.join(options.packageDir, 'package-info.json');
    const packageInfoJson = JSON.parse(
      fs.readFileSync(packageInfoFile, 'utf8'),
    ) as PackageInfo;
    packageInfoJson.keyInstructions = {
      link: analysis.setupInstructionsLink,
    };
    fs.writeFileSync(packageInfoFile, JSON.stringify(packageInfoJson, null, 2));
  }

  // Update research report
  await updateResearchReport(
    'analyzeLinks',
    {
      usage,
      status: 'success',
      totalTokens: usage.totalTokens,
      details: {
        'Useful Links': analysis.documentationLinks.length,
        'Total Links': links.length,
        'Filtered Links': newLinks.length,
        'Setup Instructions': analysis.setupInstructionsLink
          ? 'Found'
          : 'Not Found',
      },
    },
    options.packageDir,
  );

  return analysis.documentationLinks;
}

/**
 * Extract content from a list of URLs
 */
export async function extractContentFromUrls(
  urls: string[],
  options: { packageDir: string; baseUrl: string },
): Promise<{ url: string; content: string }[]> {
  console.log(`🌐 Extracting content from ${urls.length} URLs...`);

  await updateResearchReport(
    'extractContentFromUrls',
    {
      status: 'in-progress',
      details: {
        'Extracting Content from URLs': urls.length,
        'Estimated Time': `This might take a while, please wait...`,
      },
    },
    options.packageDir,
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
    ],
  });

  let results: { url: string; content: string }[] = [];
  let totalContentLength = 0;
  let failedUrls: string[] = [];
  let skippedUrls: string[] = [];

  const scrapedDocsDir = path.join(options.packageDir, './scrapedDocs');
  fs.mkdirSync(scrapedDocsDir, {
    recursive: true,
  });

  // Helper function to check if file needs to be scraped
  const needsScraping = (filePath: string): boolean => {
    if (!fs.existsSync(filePath)) {
      return true; // File doesn't exist, needs scraping
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileData = JSON.parse(fileContent);

      if (!fileData.updatedAt) {
        return true; // No timestamp, needs scraping
      }

      const updatedAt = new Date(fileData.updatedAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      return updatedAt < oneDayAgo; // Needs scraping if older than a day
    } catch (error) {
      console.warn(
        `Error reading existing file ${filePath}, will re-scrape:`,
        error,
      );
      return true; // Error reading file, needs scraping
    }
  };

  try {
    for (const url of urls) {
      try {
        const validatedUrl = validateUrl(url);

        let cleanURLwithoutSlashes = validatedUrl
          ?.replace(options.baseUrl, '')
          .replace(/\//g, '-');
        cleanURLwithoutSlashes = 'base-' + cleanURLwithoutSlashes;

        const filePath = path.join(
          scrapedDocsDir,
          `${cleanURLwithoutSlashes}.json`,
        );

        // Check if we need to scrape this URL
        if (!needsScraping(filePath)) {
          console.log(`⏭️  Skipping ${validatedUrl} - file is up to date`);

          // Load existing content
          const existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          results.push({ url: validatedUrl, content: existingContent.content });
          totalContentLength += existingContent.content.length;
          skippedUrls.push(validatedUrl);
          continue;
        }

        console.log(`📄 Extracting content from ${validatedUrl}...`);
        const page = await browser.newPage();

        // Set random user agent
        await page.setUserAgent(getRandomUserAgent());

        // Set additional headers
        await page.setExtraHTTPHeaders({
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          DNT: '1',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        });

        // Add random delay before navigation
        await randomDelay();

        await page.goto(validatedUrl, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        });

        // Extract text content from the page
        const content = await page.evaluate(() => {
          // Remove script and style elements
          const scripts = document.querySelectorAll('script, style');
          scripts.forEach(script => script.remove());

          // Get text content from body
          return document.body.innerText;
        });

        fs.writeFileSync(
          filePath,
          JSON.stringify(
            { url: validatedUrl, content, updatedAt: new Date().toISOString() },
            null,
            2,
          ),
        );

        results.push({ url: validatedUrl, content });
        totalContentLength += content.length;
        console.log(
          `✅ Extracted ${content.length} characters from ${validatedUrl}`,
        );

        await page.close();
      } catch (error) {
        console.error(`❌ Error extracting content from ${url}:`, error);
        failedUrls.push(url);
        // Add longer delay after an error
        await randomDelay(5000, 10000);
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`✅ Extracted content from ${results.length} URLs`);
  console.log(`⏭️  Skipped ${skippedUrls.length} URLs (up to date)`);

  // Update research report
  await updateResearchReport(
    'extractContentFromUrls',
    {
      status: 'success',
      details: {
        'Successfully Extracted': results.length,
        'Skipped URLs (up to date)': skippedUrls.length,
        'Failed URLs': failedUrls.length,
        'Total Content Length': `${(totalContentLength / 1024).toFixed(2)} KB`,
        'Average Content Length': `${(totalContentLength / results.length / 1024).toFixed(2)} KB`,
      },
    },
    options.packageDir,
  );

  return results;
}

/**
 * Scrape content from a single URL
 */
export async function scrapeUrl(url: string): Promise<string> {
  const validatedUrl = validateUrl(url);
  console.log(`🌐 Scraping content from ${validatedUrl}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set random user agent
    await page.setUserAgent(getRandomUserAgent());

    // Set additional headers
    await page.setExtraHTTPHeaders({
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      DNT: '1',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
    });

    // Add random delay before navigation
    await randomDelay();

    await page.goto(validatedUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Extract text content from the page
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style');
      scripts.forEach(script => script.remove());

      // Get text content from body
      return document.body.innerText;
    });

    console.log(
      `✅ Extracted ${content.length} characters from ${validatedUrl}`,
    );
    return content;
  } finally {
    await browser.close();
  }
}
