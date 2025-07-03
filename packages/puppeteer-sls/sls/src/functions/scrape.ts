import { Handler } from 'aws-lambda';
import { Redis } from '@upstash/redis';
import { puppeteerLaunchProps } from '@microfox/puppeteer-sls';
import puppeteer, { Browser } from 'puppeteer-core';
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

interface ScrapeRequest {
    url: string;
    jobId: string;
}

export const scrape: Handler<ScrapeRequest> = async (event) => {
  const { url, jobId } = event;
  let browser: Browser | null = null;

  try {
    await redis.set(jobId, JSON.stringify({ status: 'RUNNING', url }));

    // Set environment variables to help puppeteer detect Lambda environment
    process.env.AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME || 'scrape';
    process.env.SERVERLESS_STAGE = process.env.SERVERLESS_STAGE || 'production';
    
    const launchProps = await puppeteerLaunchProps();
    console.log('Launch props:', launchProps);
    
    browser = await puppeteer.launch(launchProps);
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Example: Scrape the title of the page
    const title = await page.title();
    
    const result = {
      status: 'COMPLETED',
      url,
      title,
      scrapedAt: new Date().toISOString(),
    };

    await redis.set(jobId, JSON.stringify(result));
    console.log(`Scraping job ${jobId} completed successfully.`);

  } catch (error) {
    console.error(`Error during scraping job ${jobId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorResult = {
      status: 'FAILED',
      url,
      error: errorMessage,
    };
    await redis.set(jobId, JSON.stringify(errorResult));
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}; 