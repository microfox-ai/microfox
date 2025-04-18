import puppeteer from 'puppeteer';
import { generateObject } from 'ai';
import { models } from '../ai/models';
import { z } from 'zod';

// User agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
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
  usefulLinks: z.array(z.string()).describe('Array of useful links for package creation'),
  reason: z.string().describe('Reason why these links were selected'),
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
    throw new Error(`Invalid URL: ${url}. Please provide a valid URL including the protocol (http:// or https://)`);
  }
}

/**
 * Extract all links from a webpage using Puppeteer
 */
export async function extractLinks(url: string): Promise<string[]> {
  const validatedUrl = validateUrl(url);
  
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
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
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
      timeout: 30000 
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
    
    // Remove duplicates and normalize URLs
    const uniqueLinks = [...new Set(links)].map(link => {
      try {
        const url = new URL(link);
        return url.toString();
      } catch (e) {
        return link;
      }
    });
    
    console.log(`✅ Extracted ${uniqueLinks.length} unique links from ${validatedUrl}`);
    return uniqueLinks;
  } finally {
    await browser.close();
  }
}

/**
 * Analyze links to determine which ones are useful for package creation
 */
export async function analyzeLinks(links: string[], query: string): Promise<string[]> {
  console.log(`🧠 Analyzing ${links.length} links to find useful ones for "${query}"...`);
  
  const { object: analysis } = await generateObject({
    model: models.googleGeminiFlash,
    schema: LinkAnalysisSchema,
    system: `
      You are a helpful assistant that analyzes links and determines which ones are most useful for creating a package based on a query.
    `,
    prompt: `
      Analyze these links and determine which ones are most useful for creating a package based on this query: "${query}"

      Links:
      ${links.map((link, i) => `${i + 1}. ${link}`).join('\n')}
      
      Select only the links that contain:
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

      Return only the most relevant links (maximum 10) that will help in creating a comprehensive SDK.
    `,
    temperature: 0.5,
  });
  
  console.log(`✅ Selected ${analysis.usefulLinks.length} useful links: ${analysis.reason}`);
  return analysis.usefulLinks;
}

/**
 * Extract content from a list of URLs
 */
export async function extractContentFromUrls(urls: string[]): Promise<{ url: string; content: string }[]> {
  console.log(`🌐 Extracting content from ${urls.length} URLs...`);
  
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
  
  try {
    for (const url of urls) {
      try {
        const validatedUrl = validateUrl(url);
        
        console.log(`📄 Extracting content from ${validatedUrl}...`);
        const page = await browser.newPage();
        
        // Set random user agent
        await page.setUserAgent(getRandomUserAgent());
        
        // Set additional headers
        await page.setExtraHTTPHeaders({
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
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
          timeout: 30000 
        });
        
        // Extract text content from the page
        const content = await page.evaluate(() => {
          // Remove script and style elements
          const scripts = document.querySelectorAll('script, style');
          scripts.forEach(script => script.remove());
          
          // Get text content from body
          return document.body.innerText;
        });
        console.log('qweertey', content);
        
        results.push({ url: validatedUrl, content });
        console.log(`✅ Extracted ${content.length} characters from ${validatedUrl}`);
      } catch (error) {
        console.error(`❌ Error extracting content from ${url}:`, error);
        // Add longer delay after an error
        await randomDelay(5000, 10000);
      }
    }
  } finally {
    await browser.close();
  }
  
  console.log(`✅ Extracted content from ${results.length} URLs`);
  return results;
} 