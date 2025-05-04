## Function: `getSimplePrice`

Retrieves the simple price of one or more coins in a given set of target currencies.

**Purpose:**

This function fetches the current price of specified coins in the requested target currencies.

**Parameters:**

- `params`: <object> An object containing the request parameters.
  - `vs_currencies`: <string> Comma-separated target currencies (e.g., "usd,eur,btc"). This parameter is required.
  - `ids`: <string> (Optional) Comma-separated coin IDs (e.g., "bitcoin,ethereum").
  - `names`: <string> (Optional) Comma-separated coin names (e.g., "Bitcoin,Ethereum").
  - `symbols`: <string> (Optional) Comma-separated coin symbols (e.g., "btc,eth").
  - `include_tokens`: <enum> (Optional) Include all matching tokens or only top tokens. Possible values: "all", "top".
  - `include_market_cap`: <boolean> (Optional) Include market cap data.
  - `include_24hr_vol`: <boolean> (Optional) Include 24-hour volume data.
  - `include_24hr_change`: <boolean> (Optional) Include 24-hour change data.
  - `include_last_updated_at`: <boolean> (Optional) Include last updated time data.
  - `precision`: <string | "full"> (Optional) Decimal places for price. Use "full" for full precision.

**Return Value:**

- `Promise<SimplePriceResponse>`: A promise that resolves to a SimplePriceResponse object.
  - `SimplePriceResponse`: <object> A record where keys are coin IDs and values are objects containing prices in different currencies.

**Examples:**

```typescript
// Example 1: Get simple price for Bitcoin in USD
async function getBitcoinPrice() {
  const priceResponse = await sdk.getSimplePrice({
    vs_currencies: "usd",
    ids: "bitcoin",
  });
  console.log(priceResponse);
}

getBitcoinPrice();

// Example 2: Get simple price for multiple coins in multiple currencies
async function getMultiplePrices() {
  const priceResponse = await sdk.getSimplePrice({
    vs_currencies: "usd,eur,btc",
    ids: "bitcoin,ethereum",
    include_market_cap: true,
    include_24hr_vol: true,
  });
  console.log(priceResponse);
}

getMultiplePrices();
```