# Paginator Constructor

The `Paginator` class provides a robust way to manage and track the state of long-running pagination or indexing tasks using Upstash Redis. It is designed to be generic and can handle any progress state structure.

## Instantiation

To create a new `Paginator` instance, you need to provide an Upstash Redis client instance and a unique ID for the pagination task.

```typescript
new Paginator<T>(redis: Redis, id: string)
```

### Parameters

- `redis` (`Redis`): An active Upstash Redis client instance from `@upstash/redis`. The `Paginator` uses this client to communicate with your Redis database.
- `id` (`string`): A unique identifier for the pagination task. This ID is used to create a unique key in Redis, ensuring that different pagination tasks do not interfere with each other.
- `T` (`generic`): A TypeScript generic type that defines the shape of the `progress` object. This allows you to customize the state you want to track. It defaults to `Record<string, any>`.

### Example

```typescript
import { Redis } from '@upstash/redis';
import { Paginator } from '@microfox/db-upstash';

// Define the shape of your pagination progress
interface MyScraperProgress {
  page: number;
  lastId: string | null;
  itemsProcessed: number;
}

// Initialize the Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Create a new Paginator instance for a specific scraping task
const myScraperPaginator = new Paginator<MyScraperProgress>(
  redis,
  'my-scraper-task-123'
);
```

````

### Method Documentation
Here are the markdown files for each of the public methods, which I'll place in `packages/db-upstash/docs/functions/`:

<details>
<summary><code>startNewIndexing.md</code></summary>

```markdown:packages/db-upstash/docs/functions/startNewIndexing.md
# startNewIndexing

Initializes a new indexing or pagination task. This method sets the initial state in Redis, marks the status as 'running', and records the start time.

## Signature
```typescript
startNewIndexing(initialProgress: T): Promise<IPaginationStatus<T>>
````

### Parameters

- `initialProgress` (`T`): An object representing the starting progress of the task. The shape of this object must match the generic type `T` provided to the `Paginator` constructor.

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the newly created pagination status object.

### Example

```typescript
const initialProgress = {
  page: 1,
  lastId: null,
  itemsProcessed: 0,
};

const status = await myScraperPaginator.startNewIndexing(initialProgress);
console.log(status);
// {
//   status: 'running',
//   progress: { page: 1, lastId: null, itemsProcessed: 0 },
//   startedAt: 1678886400000,
//   lastUpdatedAt: 1678886400000
// }
```

````

</details>

<details>
<summary><code>updateIndexingStatus.md</code></summary>

```markdown:packages/db-upstash/docs/functions/updateIndexingStatus.md
# updateIndexingStatus

Updates the progress of an ongoing indexing task. This is the most common method to call during a scraping loop to save the latest state.

## Signature
```typescript
updateIndexingStatus(newProgress: Partial<T>): Promise<IPaginationStatus<T>>
````

### Parameters

- `newProgress` (`Partial<T>`): An object containing the progress fields to update. It will be merged with the existing progress state.

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the updated pagination status object.

### Example

```typescript
const status = await myScraperPaginator.updateIndexingStatus({
  page: 2,
  itemsProcessed: 100,
});

console.log('Progress updated:', status.progress);
// Progress updated: { page: 2, lastId: 'some-last-id', itemsProcessed: 100 }
```

````

</details>

<details>
<summary><code>completeIndexing.md</code></summary>

```markdown:packages/db-upstash/docs/functions/completeIndexing.md
# completeIndexing

Marks an indexing task as 'completed'. This is the final state for a successful task.

## Signature
```typescript
completeIndexing(): Promise<IPaginationStatus<T>>
````

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the final pagination status object with a `status` of `'completed'`.

### Example

```typescript
await myScraperPaginator.completeIndexing();
console.log('Scraping job completed!');
```

````

</details>

<details>
<summary><code>pauseIndexing.md</code></summary>

```markdown:packages/db-upstash/docs/functions/pauseIndexing.md
# pauseIndexing

Pauses a running indexing task. This sets the status to `'paused'`.

## Signature
```typescript
pauseIndexing(): Promise<IPaginationStatus<T>>
````

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the updated pagination status object with a `status` of `'paused'`.

### Example

```typescript
await myScraperPaginator.pauseIndexing();
console.log('Scraper has been paused.');
```

````

</details>

<details>
<summary><code>resumeIndexing.md</code></summary>

```markdown:packages/db-upstash/docs/functions/resumeIndexing.md
# resumeIndexing

Resumes a paused indexing task by setting its status back to `'running'`.

## Signature
```typescript
resumeIndexing(): Promise<IPaginationStatus<T>>
````

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the updated pagination status object with a `status` of `'running'`.

### Example

```typescript
const status = await myScraperPaginator.resumeIndexing();
console.log(`Resumed at page: ${status.progress.page}`);
```

````

</details>

<details>
<summary><code>failIndexing.md</code></summary>

```markdown:packages/db-upstash/docs/functions/failIndexing.md
# failIndexing

Marks an indexing task as 'failed' and stores an error message. This is useful for formally recording a failure state.

## Signature
```typescript
failIndexing(error: Record<string, any> | string): Promise<IPaginationStatus<T>>
````

### Parameters

- `error` (`Record<string, any> | string`): The error to be stored. Can be a simple string or a more detailed object.

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the final pagination status object with a `status` of `'failed'`.

### Example

```typescript
try {
  // some failing operation
  throw new Error('API rate limit exceeded');
} catch (e: any) {
  await myScraperPaginator.failIndexing({ message: e.message, code: 500 });
  console.log('Scraper job failed.');
}
```

````

</details>

<details>
<summary><code>getCurrentStatus.md</code></summary>

```markdown:packages/db-upstash/docs/functions/getCurrentStatus.md
# getCurrentStatus

Retrieves the current status and progress of the indexing task from Redis.

## Signature
```typescript
getCurrentStatus(): Promise<IPaginationStatus<T> | null>
````

### Returns

- (`Promise<IPaginationStatus<T> | null>`): A promise that resolves to the current pagination status object, or `null` if the task has not been started.

### Example

```typescript
const status = await myScraperPaginator.getCurrentStatus();

if (status) {
  console.log(`Current status: ${status.status}`);
} else {
  console.log('No job found. Starting a new one.');
}
```

````

</details>

<details>
<summary><code>isStale.md</code></summary>

```markdown:packages/db-upstash/docs/functions/isStale.md
# isStale

Checks if an indexing task is stale by comparing its `lastUpdatedAt` timestamp with a given timeout. This is useful for detecting and restarting stuck or dead worker processes.

## Signature
```typescript
isStale(timeoutSeconds: number): Promise<boolean>
````

### Parameters

- `timeoutSeconds` (`number`): The timeout in seconds. If the task has not been updated within this period, it is considered stale.

### Returns

- (`Promise<boolean>`): A promise that resolves to `true` if the task is stale, otherwise `false`.

### Example

```typescript
// Check if the scraper has been silent for more than 5 minutes
const isStuck = await myScraperPaginator.isStale(300);

if (isStuck) {
  console.log('Warning: Scraper job appears to be stale!');
}
```

````

</details>

<details>
<summary><code>resetIndexing.md</code></summary>

```markdown:packages/db-upstash/docs/functions/resetIndexing.md
# resetIndexing

Deletes all data associated with the indexing task from Redis. This is a destructive operation and should be used with care.

## Signature
```typescript
resetIndexing(): Promise<void>
````

### Returns

- (`Promise<void>`): A promise that resolves when the data has been deleted.

### Example

```typescript
// Clean up the task state after it's no longer needed
await myScraperPaginator.resetIndexing();
console.log('Paginator state has been reset.');
```

````

</details>

### Package README
Finally, I'll create a `README.md` for the `@microfox/db-upstash` package to provide an overview and a clear example.

```markdown:packages/db-upstash/README.md
# @microfox/db-upstash

A TypeScript SDK for interacting with Upstash Redis, providing helpful utilities and classes.

## Features

- **Paginator**: A generic class for managing the state of long-running pagination or indexing tasks.

## Installation

```bash
npm install @microfox/db-upstash @upstash/redis
````

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

```

These files should provide comprehensive documentation for your new `Paginator` class. Let me know if you'd like any adjustments
```
