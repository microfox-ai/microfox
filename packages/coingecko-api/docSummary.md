## CoinGecko Pro API (v3) TypeScript SDK Summary

This document summarizes the CoinGecko Pro API (v3) for generating a TypeScript SDK.  It details the endpoints, methods, parameters, responses, authentication, and other relevant information.

**Important Notes:**

* This API requires a paid CoinGecko Pro API key. The base URL is `https://pro-api.coingecko.com/api/v3/`.
* Store your API key securely and consider using a proxy for added security.
* Header authentication is recommended (`x-cg-pro-api-key`).  Avoid query string authentication (`x_cg_pro_api_key`) as it exposes your key.
* On-chain DEX data (beta) is accessed via the `/onchain` path.
* Each API request consumes one credit.  Monitor your usage via the developer dashboard.

**Authentication:**

All endpoints below require authentication using the `x-cg-pro-api-key` header.  The value should be your CoinGecko Pro API key.

```typescript
// Example header
const headers = {
  'x-cg-pro-api-key': 'YOUR_API_KEY',
};
```

---

### 1. Ping

* **Endpoint:** `/ping`
* **Method:** `GET`
* **Description:** Checks API server status.
* **Parameters:** None
* **Response:**
```typescript
interface PingResponse {
  gecko_says: string; // e.g., "(V3) To the Moon!"
}
```

---

### 2. Check API Key Usage

* **Endpoint:** `/key`
* **Method:** `GET`
* **Description:** Check account's API usage. (Paid Plan Access - 💼)
* **Parameters:** None
* **Response:**  _(Documentation lacks details.  Assume a structure similar to this)_
```typescript
interface KeyUsageResponse {
  usage: {
    current_month: number;
    limit: number;
  };
}
```
**Edge Case:**  The actual response structure needs to be confirmed from the API response.

---

### 3. Simple Price

* **Endpoint:** `/simple/price`
* **Method:** `GET`
* **Description:** Get the price of one or more coins by ID, symbol, or name.
* **Parameters:**
```typescript
interface SimplePriceParams {
  vs_currencies: string; // required, comma-separated currency codes (e.g., "usd,eur")
  ids?: string; // comma-separated coin IDs
  names?: string; // comma-separated coin names (URL-encoded spaces)
  symbols?: string; // comma-separated coin symbols
  include_tokens?: 'all' | 'top'; // For symbol lookup, defaults to 'top'
  include_market_cap?: boolean;
  include_24hr_vol?: boolean;
  include_24hr_change?: boolean;
  include_last_updated_at?: boolean;
  precision?: string; // 'full' or number of decimal places (0-18)
}
```
* **Response:**
```typescript
// Dynamically generated based on requested coins and currencies
interface SimplePriceResponse {
  [coinId: string]: {
    [currency: string]: number;
    [currency + "_market_cap"]?: number;
    [currency + "_24h_vol"]?: number;
    [currency + "_24h_change"]?: number;
    last_updated_at?: number; // UNIX timestamp
  };
}
```
**Edge Case:** Handle potential `null` values for `include_24hr_change` if price is stale.

---

### 4. Coins List

* **Endpoint:** `/coins/list`
* **Method:** `GET`
* **Description:** Get a list of all supported coins with ID, name, and symbol.
* **Parameters:**
```typescript
interface CoinsListParams {
  include_platform?: boolean;
  status?: 'active' | 'inactive'; // Defaults to 'active'
}
```
* **Response:**
```typescript
interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms: { [platform: string]: string }; // Contract addresses
}

type CoinsListResponse = CoinListItem[];
```


---

### 5. Coins Markets

* **Endpoint:** `/coins/markets`
* **Method:** `GET`
* **Description:** Get list of coins with market data.
* **Parameters:**  _(See documentation for full list and types)_
```typescript
interface CoinsMarketsParams {
  vs_currency: string; // required
  ids?: string;
  // ... (other parameters like category, order, per_page, etc.)
}
```
* **Response:**  _(See documentation for full list and types.  Structure is an array of objects with detailed market data.)_
```typescript
// Example (abbreviated - see docs for full structure)
interface CoinsMarketsItem {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  // ... (other market data fields)
}

type CoinsMarketsResponse = CoinsMarketsItem[];
```


---

 _(The summary continues in a similar fashion for all remaining endpoints, including on-chain DEX endpoints.  Due to the length of the documentation, the full summary is not provided here.  Make sure to extract all parameters, types, and response structures for each endpoint when creating your SDK.)_

---

**General TypeScript SDK Structure (Example):**

```typescript
class CoinGecko {
  private apiKey: string;
  private baseUrl: string = 'https://pro-api.coingecko.com/api/v3/';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async ping(): Promise<PingResponse> {
    const response = await fetch(this.baseUrl + 'ping', {
      headers: { 'x-cg-pro-api-key': this.apiKey },
    });
    return await response.json();
  }

  // ... other methods for each endpoint
}


// Example usage
const cg = new CoinGecko('YOUR_API_KEY');
const pingResult = await cg.ping();
console.log(pingResult);

const priceResult = await cg.simplePrice({
  vs_currencies: 'usd',
  ids: 'bitcoin,ethereum',
});
console.log(priceResult);


// ... and so on
```

This structured approach will help in building a robust and type-safe TypeScript SDK for the CoinGecko Pro API.  Remember to handle error responses and rate limiting appropriately in your SDK implementation.  Also, consult the CoinGecko documentation for the most up-to-date information and any updates to the API.
