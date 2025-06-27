# Brave SDK Headers Documentation

## Overview

The Brave SDK allows you to configure custom headers for API requests. Headers can be set either manually or using helper functions.

## Header Configuration

### Manual Header Configuration

You can manually configure headers by passing them directly to the SDK:

```typescript
const brave = createBraveSDK({
  apiKey: 'your-api-key',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
    'X-Loc-Lat': 40.7128,
    'X-Loc-Long': -74.006,
    'X-Loc-Timezone': 'America/New_York',
    'X-Loc-City': 'New York',
    'X-Loc-State': 'NY',
    'X-Loc-State-Name': 'New York',
    'X-Loc-Country': 'US',
    'X-Loc-Postal-Code': '10001',
    'Api-Version': '2024-01-01',
    'Cache-Control': 'no-cache',
  },
});
```

### Using Helper Functions

For convenience, you can use the provided helper functions to create headers:

```typescript
const brave = createBraveSDK({
  apiKey: 'your-api-key',
  headers: createHeaders({
    apiKey: 'your-api-key',
    platform: 'macos',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
      city: 'New York',
      state: 'NY',
      stateName: 'New York',
      country: 'US',
      postalCode: '10001',
    },
    apiVersion: '2024-01-01',
    cacheControl: 'no-cache',
  }),
});
```

## Local Search Headers

For local search requests, you can configure separate headers:

```typescript
const brave = createBraveSDK({
  apiKey: 'your-api-key',
  // ... other configuration
  localSearchHeaders: createLocalSearchHeaders({
    apiKey: 'your-api-key',
    platform: 'ios',
    apiVersion: '2024-01-01',
  }),
});
```

## Available Header Options

### Standard Headers

- `User-Agent`: Browser/device identification
- `Api-Version`: API version (e.g., '2024-01-01')
- `Cache-Control`: Cache control directives

### Location Headers

- `X-Loc-Lat`: Latitude coordinate
- `X-Loc-Long`: Longitude coordinate
- `X-Loc-Timezone`: Timezone (e.g., 'America/New_York')
- `X-Loc-City`: City name
- `X-Loc-State`: State code
- `X-Loc-State-Name`: Full state name
- `X-Loc-Country`: Country code
- `X-Loc-Postal-Code`: Postal/ZIP code
