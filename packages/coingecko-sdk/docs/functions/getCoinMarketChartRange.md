## Function: `getCoinMarketChartRange`

Gets the market chart data within a specific date range for a coin.

**Purpose:**
Retrieves price, market cap, and volume data for a cryptocurrency within a specified date range.

**Parameters:**
* `id`: <string> **required** The ID of the coin. Example: `"bitcoin"`
* `params`: <object> **required**
    * `vs_currency`: <string> **required** Target currency. Example: `"usd"`
    * `from`: <number> **required** UNIX timestamp for the start of the range. Example: `1666828800`
    * `to`: <number> **required** UNIX timestamp for the end of the range. Example: `1667174400`

**Return Value:**
* `CoinMarketChart`: <object> Market chart data.
    * `prices`: <array<array<number>>> Array of price data points (timestamp, price).
    * `market_caps`: <array<array<number>>> Array of market cap data points (timestamp, market cap).
    * `total_volumes`: <array<array<number>>> Array of total volume data points (timestamp, total volume).

**Examples:**
```typescript
const chartData = await sdk.getCoinMarketChartRange("bitcoin", {
  vs_currency: "usd",
  from: 1666828800,
  to: 1667174400,
});
console.log(chartData);
```