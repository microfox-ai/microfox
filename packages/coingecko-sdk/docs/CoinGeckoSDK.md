## Constructor: `CoinGeckoSDK`

Initializes a new instance of the CoinGeckoSDK.

**Purpose:**

The constructor initializes the SDK with the API key required to make requests to the CoinGecko API.

**Parameters:**

- `options`: <object> An object containing the API key.
  - `apiKey`: <string> The CoinGecko Pro API key. This is a required parameter.

**Return Value:**

- `CoinGeckoSDK`: A new instance of the CoinGeckoSDK.

**Examples:**

```typescript
// Example: Initialize CoinGeckoSDK with API key
const sdk = new CoinGeckoSDK({
  apiKey: process.env.COINGECKO_API_KEY,
});
```