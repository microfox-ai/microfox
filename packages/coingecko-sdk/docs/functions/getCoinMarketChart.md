## Function: `getCoinMarketChart`

Gets the market chart data for a specific coin.

**Purpose:**
Retrieves price, market cap, and volume data for a cryptocurrency over a specified number of days.

**Parameters:**
* `id`: <string> **required** The ID of the coin. Example: `"bitcoin"`
* `params`: <object> **required**
    * `vs_currency`: <string> **required** Target currency. Example: `"usd"`
    * `days`: <string> **required** Number of days ago (e.g., `"1"`, `"7"`, `"14"`, `"30"`, `"max"`). Example: `"7"`
    * `interval`: <string | undefined> Data interval (e.g., `"daily"`). Example: `"daily"`

**Return Value:**
* `CoinMarketChart`: <object> Market chart data.
    * `prices`: <array<array<number>>> Array of price data points (timestamp, price).
    * `market_caps`: <array<array<number>>> Array of market cap data points (timestamp, market cap).
    * `total_volumes`: <array<array<number>>> Array of total volume data points (timestamp, total volume).

**Examples:**
```typescript
const chartData = await sdk.getCoinMarketChart("bitcoin", { vs_currency: "usd", days: "7" });
console.log(chartData);
```