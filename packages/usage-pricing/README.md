# @microfox/usage-pricing

A TypeScript SDK for tracking and managing usage-based pricing in Microfox applications. This SDK provides functionality to track, retrieve, and analyze usage data with built-in pricing calculations.

## Installation

```bash
npm install @microfox/usage-pricing
# or
yarn add @microfox/usage-pricing
```

## Configuration

The SDK requires Redis configuration for storing and retrieving usage data. You can provide the configuration in two ways:

1. Through environment variables:

```env
MICROFOX_REDIS_URL_TRACKER=your_redis_url
MICROFOX_REDIS_TOKEN_TRACKER=your_redis_token
MICROFOX_CLIENT_REQUEST_ID=your_client_id
```

2. Through constructor options:

```typescript
import { createMicrofoxUsagePricing } from '@microfox/usage-pricing';

const usagePricing = createMicrofoxUsagePricing({
  redisOptions: {
    url: 'your_redis_url',
    token: 'your_redis_token',
  },
  prefix: 'your_prefix',
});
```

## Usage

### Basic Usage

```typescript
import { createDefaultMicrofoxUsagePricing } from '@microfox/usage-pricing';

const usagePricing = createDefaultMicrofoxUsagePricing();
```

### API Reference

#### Get Usage Data

```typescript
// Get usage with pagination
const usage = await usagePricing.getUsage(packageName, prefixDateKey, {
  limit: 100,
  offset: 0,
});

// Get daily usage
const dailyUsage = await usagePricing.getDailyUsage(packageName, {
  limit: 100,
  offset: 0,
});

// Get monthly usage
const monthlyUsage = await usagePricing.getMonthlyUsage(packageName, {
  limit: 100,
  offset: 0,
});

// Get yearly usage
const yearlyUsage = await usagePricing.getYearlyUsage(packageName, {
  limit: 100,
  offset: 0,
});
```

#### Get Full Usage Data

```typescript
// Get full usage data
const fullUsage = await usagePricing.getFullUsage(packageName, prefixDateKey);

// Get full daily usage
const fullDailyUsage = await usagePricing.getFullDailyUsage(packageName);

// Get full monthly usage
const fullMonthlyUsage = await usagePricing.getFullMonthlyUsage(packageName);

// Get full yearly usage
const fullYearlyUsage = await usagePricing.getFullYearlyUsage(packageName);
```

### Response Format

The usage data is returned in the following format:

```typescript
{
  data: Usage[], // Array of usage entries with pricing information
  total: number, // Total number of items
  limit: number, // Number of items per page
  offset: number, // Current offset
  hasMore: boolean // Whether there are more items to fetch
}
```

Each usage entry includes:

- Usage metrics
- Package information
- Timestamp
- Pricing information (automatically attached)

## Types

### UsageTrackerConstructorOptions

```typescript
interface UsageTrackerConstructorOptions {
  redisOptions?: {
    url?: string;
    token?: string;
  };
  prefix?: string;
}
```

### Usage

The Usage type represents a single usage entry with pricing information attached.

## Error Handling

The SDK handles various error cases:

- Invalid Redis configuration
- Missing environment variables
- Invalid usage data format

## Best Practices

1. Always provide proper Redis configuration
2. Use appropriate pagination parameters to manage large datasets
3. Handle the response data appropriately in your application
4. Monitor usage patterns using the different time-based methods

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
