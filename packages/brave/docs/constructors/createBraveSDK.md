## Function: `createBraveSDK`

Creates a new instance of the Brave SDK.

**Purpose:**
This function creates and returns a new instance of the `BraveSDK` class, which can be used to interact with the Brave Search API.

**Parameters:**

- `options` (BraveSDKOptions, optional): An object containing configuration options.
  - `apiKey` (string, optional): Your Brave Search API key. If not provided, the constructor will try to use the `BRAVE_API_KEY` environment variable.
  - `headers` (RequestHeaders, optional): Custom headers for web search requests.
  - `localSearchHeaders` (LocalSearchHeaders, optional): Custom headers for local search requests.
  - `enableRedisTracking` (boolean, optional): Enable Redis tracking for requests.
  - `redisTrackingId` (string, optional): Custom ID for Redis tracking.

**Return Value:**

- `BraveSDK`: A new instance of the `BraveSDK` class.

**Examples:**

```typescript
// Example 1: Basic usage with API key
const braveSDK = createBraveSDK({ apiKey: process.env.BRAVE_API_KEY });

// Example 2: Using environment variable
const braveSDK = createBraveSDK(); // Assumes BRAVE_API_KEY is set in the environment

// Example 4: With Redis tracking enabled
const braveSDK = createBraveSDK({
  apiKey: process.env.BRAVE_API_KEY,
  enableRedisTracking: true,
  redisTrackingId: 'custom-tracking-id',
});
```

## Header Configuration

### Manual Header Configuration

You can manually configure headers by passing them directly to the SDK:

```typescript
const brave = createBraveSDK({
  apiKey: 'your-api-key',
  headers: {
    'X-Loc-State': 'NY',
    'X-Loc-Country': 'US',
  },
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
