## Function: `getCoinsMarkets`

Retrieves market data for one or more coins.

**Purpose:**

This function fetches market data for the specified coins, including price, market cap, volume, and other relevant information.

**Parameters:**

- `params`: <object> An object containing the request parameters.
  - `vs_currency`: <string> Target currency (e.g., "usd"). This parameter is required.
  - `ids`: <string> (Optional) Comma-separated coin IDs (e.g., "bitcoin,ethereum").
  - `category`: <string> (Optional) Filter by category.
  - `order`: <string> (Optional) Sort order.
  - `per_page`: <number> (Optional) Results per page (min: 1, max: 250).
  - `page`: <number> (Optional) Page number (min: 1).
  - `sparkline`: <boolean> (Optional) Include 7-day sparkline data.
  - `price_change_percentage`: <string> (Optional) Comma-separated price change percentage timeframes (e.g., "1h,24h,7d").
  - `locale`: <string> (Optional) Language.
 - `precision`: <string | "full"> (Optional) Decimal places for price. Use "full" for full precision.

**Return Value:**

- `Promise<CoinsMarketsResponse[]>`: A promise that resolves to an array of CoinsMarketsResponse objects.
  - `CoinsMarketsResponse`: <object> See the type definition for a full list of fields.

**Examples:**

```typescript
// Example 1: Get market data for Bitcoin in USD
async function getBitcoinMarketData() {
  const marketData = await sdk.getCoinsMarkets({
    vs_currency: "usd",
    ids: "bitcoin",
  });
  console.log(marketData);
}

getBitcoinMarketData();

// Example 2: Get market data for multiple coins with additional parameters
async function getMultipleMarketData() {
  const marketData = await sdk.getCoinsMarkets({
    vs_currency: "usd",
    ids: "bitcoin,ethereum",
    per_page: 100,
    page: 1,
    sparkline: true,
    price_change_percentage: "1h,24h,7d",
  });
  console.log(marketData);
}

getMultipleMarketData();
```