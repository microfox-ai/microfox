# Microfox Usage Tracker

A powerful usage tracking system for Microfox AI that enables tracking of LLM and API usage across your applications.

## Features

- Track LLM usage (tokens, models)
- Track API usage (request counts, data)
- Daily, monthly, and yearly usage reports
- Redis-based storage with Upstash
- TypeScript support with full type safety
- Environment variable configuration

## Installation

```bash
npm install @microfox/usage-tracker
```

## Configuration

The usage tracker requires Redis configuration. You can provide this either through environment variables or constructor options:

### Environment Variables

```env
MICROFOX_REDIS_URL_TRACKER=your_redis_url
MICROFOX_REDIS_TOKEN_TRACKER=your_redis_token
MICROFOX_CLIENT_REQUEST_ID=your_client_id
```

### Constructor Options

```typescript
interface UsageTrackerConstructorOptions {
  redisOptions?: {
    url: string;
    token: string;
  };
  prefix?: string;
}
```

## Supported Usage Types

### 1. LLM Usage

Track language model usage including:

- Model identifier
- Prompt tokens
- Completion tokens
- Optional markup percentage

```typescript
interface LLMUsage {
  type: 'llm';
  model?: string;
  promptTokens: number;
  completionTokens: number;
}
```

### 2. API Usage

Track API usage including:

- Request key
- Request count
- Optional request data size
- Optional markup percentage

```typescript
interface API1Usage {
  type: 'api_1';
  requestKey?: string;
  requestCount: number;
  requestData?: number;
}
```

## Usage Examples

### Basic Setup

```typescript
import { createMicrofoxUsageTracker } from '@microfox/usage-tracker';

const tracker = createMicrofoxUsageTracker({
  redisOptions: {
    url: 'your_redis_url',
    token: 'your_redis_token',
  },
});
```

### Tracking LLM Usage

```typescript
await tracker.trackLLMUsage('my-package', 'gpt-4', {
  promptTokens: 100,
  completionTokens: 50,
});
```

### Tracking API Usage

```typescript
await tracker.trackApi1Usage('my-package', 'api-key', {
  requestCount: 1,
  requestData: 1024,
});
```

### Retrieving Usage Data

```typescript
// Get today's usage
const dailyUsage = await tracker.getDailyUsage();

// Get monthly usage
const monthlyUsage = await tracker.getMonthlyUsage();

// Get yearly usage
const yearlyUsage = await tracker.getYearlyUsage();

// Get usage for specific package
const packageUsage = await tracker.getDailyUsage('my-package');
```

## Environment Variables for Package-Specific Tracking

For each package you want to track, you can set these environment variables:

```env
PACKAGE_NAME_SECRET_TRACKING=markup
PACKAGE_NAME_SECRET_MARKUP_PERCENT=10
```

Replace `PACKAGE_NAME` with your actual package name (converted to uppercase with hyphens/spaces replaced by underscores).

## License

MIT

**See the [github repo](https://github.com/microfox-ai/microfox) or [docs](https://microfox.so) for more info.**
