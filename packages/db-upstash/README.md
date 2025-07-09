# @microfox/db-upstash

A TypeScript SDK for interacting with Upstash Redis, providing helpful utilities and classes.

## Features

- **Paginator**: A generic class for managing the state of long-running pagination or indexing tasks.

## Installation

```bash
npm install @microfox/db-upstash @upstash/redis
```

## Usage

### Paginator

The `Paginator` class helps you track the progress of background jobs, scrapers, or any task that involves pagination. It can store, update, pause, and resume stateful progress information in Redis.

#### Example

```typescript
import { Redis } from '@upstash/redis';
import { Paginator } from '@microfox/db-upstash';

// Define the structure for your task's progress
interface ScraperProgress {
  page: number;
  itemsScraped: number;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const scraperId = 'user-profiles-scraper';
const paginator = new Paginator<ScraperProgress>(redis, scraperId);

async function runScraper() {
  // Start a new scraping task or resume a previous one
  let status = await paginator.getCurrentStatus();
  if (!status) {
    console.log('Starting new scraper job...');
    status = await paginator.startNewIndexing({ page: 1, itemsScraped: 0 });
  } else if (status.status === 'paused') {
    console.log('Resuming scraper job...');
    status = await paginator.resumeIndexing();
  }

  if (!status || status.status === 'completed' || status.status === 'failed') {
    console.log('Job is already completed or has failed.');
    return;
  }

  console.log(`Scraping page ${status.progress.page}...`);

  // Simulate scraping
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const newItems = 10;

  // Update the progress
  const updatedStatus = await paginator.updateIndexingStatus({
    page: status.progress.page + 1,
    itemsScraped: status.progress.itemsScraped + newItems,
  });

  console.log('Progress updated:', updatedStatus.progress);

  // Complete the job after a few pages
  if (updatedStatus.progress.page > 5) {
    await paginator.completeIndexing();
    console.log('Scraping job completed!');
  }
}

runScraper().catch(console.error);
```

For detailed API documentation, please refer to the files in the `docs/` directory.
