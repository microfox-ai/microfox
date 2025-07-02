## Constructor: `CoinGeckoSDK`

Initializes a new instance of the CoinGeckoSDK.

**Purpose:**
Provides methods for interacting with the CoinGecko API.

**Parameters:**

* `options`: <object> **required**
    * `apiKey`: <string | undefined> An optional API key. If not provided, the constructor will try to use the `COINGECKO_API_KEY` environment variable.

**Return Value:**

* `CoinGeckoSDK` object

**Examples:**

```typescript
// Example 1: Initialization with API key
const sdk = new CoinGeckoSDK({ apiKey: "YOUR_API_KEY" });

// Example 2: Initialization without API key (uses environment variable)
const sdk = new CoinGeckoSDK({});
```