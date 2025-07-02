## Function: `getSimplePrice`

Gets the simple price of one or more cryptocurrencies in a given currency.

**Purpose:**
Fetches the current price of specified cryptocurrencies.

**Parameters:**
*   `params`: <object> **required**
    *   `vs_currencies`: <string> **required** Comma-separated list of target currencies. Example: `"usd,eur,btc"`
    *   `ids`: <string | undefined> Comma-separated list of coin IDs. Example: `"bitcoin,ethereum"`
    *   `names`: <string | undefined> Comma-separated list of coin names (URL-encoded spaces). Example: `"Bitcoin,Ethereum"`
    *   `symbols`: <string | undefined> Comma-separated list of coin symbols. Example: `"btc,eth"`
    *   `include_tokens`: <string | undefined> `'all'` for all matching symbols, defaults to `'top'`. Example: `"all"`
    *   `include_market_cap`: <boolean | undefined> Include market cap. Example: `true`
    *   `include_24hr_vol`: <boolean | undefined> Include 24hr volume. Example: `true`
    *   `include_24hr_change`: <boolean | undefined> Include 24hr change. Example: `true`
    *   `include_last_updated_at`: <boolean | undefined> Include last updated timestamp. Example: `true`
    *   `precision`: <string | undefined> Decimal places for price. Example: `"2"`

**Return Value:**
* `SimplePrice` <object> An object where keys are coin IDs and values are objects containing prices in different currencies.

**Examples:**
```typescript
// Example 1: Get price of Bitcoin in USD
const price = await sdk.getSimplePrice({ ids: "bitcoin", vs_currencies: "usd" });
console.log(price); // { bitcoin: { usd: 12345 } }

// Example 2: Get price of multiple coins in multiple currencies
const prices = await sdk.getSimplePrice({ ids: "bitcoin,ethereum", vs_currencies: "usd,eur" });
console.log(prices); // { bitcoin: { usd: 12345, eur: 10000 }, ethereum: { usd: 456, eur: 400 } }
```