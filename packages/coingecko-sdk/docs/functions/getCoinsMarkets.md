## Function: `getCoinsMarkets`

Gets market data for a list of coins.

**Purpose:**
Fetches market data like price, market cap, and volume for the specified cryptocurrencies.

**Parameters:**
* `params`: <object> **required**
    * `vs_currency`: <string> **required** Target currency. Example: `"usd"`
    * `ids`: <string | undefined> Comma-separated list of coin IDs. Example: `"bitcoin,ethereum"`
    * `names`: <string | undefined> Comma-separated list of coin names (URL-encoded spaces). Example: `"Bitcoin,Ethereum"`
    * `symbols`: <string | undefined> Comma-separated list of coin symbols. Example: `"btc,eth"`
    * `include_tokens`: <string | undefined> `'all'` for all matching symbols, defaults to `'top'`. Example: `"all"`
    * `category`: <string | undefined> Filter by category. Example: `"stablecoins"`
    * `order`: <string | undefined> Sort order (e.g., `"market_cap_desc"`). Example: `"market_cap_desc"`
    * `per_page`: <number | undefined> Results per page. Example: `100`
    * `page`: <number | undefined> Page number. Example: `1`
    * `sparkline`: <boolean | undefined> Include sparkline data. Example: `true`
    * `price_change_percentage`: <string | undefined> Comma-separated list of price change percentage timeframes (e.g., `"1h,24h,7d"`). Example: `"1h,24h,7d"`
    * `locale`: <string | undefined> Language. Example: `"en"`
    * `precision`: <string | undefined> Decimal places. Example: `"2"`

**Return Value:**
* `CoinMarkets` <array<object>> An array of market data objects.
    * `id`: <string> Coin ID. Example: `"bitcoin"`
    * `symbol`: <string> Coin symbol. Example: `"btc"`
    * `name`: <string> Coin name. Example: `"Bitcoin"`
    * `image`: <string> URL to the coin image. Example: `"https://..."`
    * `current_price`: <number> Current price in the target currency. Example: `29000`
    * `market_cap`: <number> Market capitalization. Example: `560000000000`
    * `market_cap_rank`: <number> Market cap rank. Example: `1`
    * `fully_diluted_valuation`: <number | null> Fully diluted valuation. Example: `600000000000`
    * `total_volume`: <number> Total trading volume. Example: `15000000000`
    * `high_24h`: <number> Highest price in the last 24 hours. Example: `29500`
    * `low_24h`: <number> Lowest price in the last 24 hours. Example: `28500`
    * `price_change_24h`: <number> Price change in the last 24 hours. Example: `500`
    * `price_change_percentage_24h`: <number> Price change percentage in the last 24 hours. Example: `1.72`
    * `market_cap_change_24h`: <number> Market cap change in the last 24 hours. Example: `10000000000`
    * `market_cap_change_percentage_24h`: <number> Market cap change percentage in the last 24 hours. Example: `1.79`
    * `circulating_supply`: <number> Circulating supply. Example: `19000000`
    * `total_supply`: <number | null> Total supply. Example: `21000000`
    * `max_supply`: <number | null> Max supply. Example: `21000000`
    * `ath`: <number> All-time high price. Example: `69000`
    * `ath_change_percentage`: <number> Percentage change from ATH. Example: `-57.97`
    * `ath_date`: <string> Date of ATH. Example: `"2021-11-10T14:24:11.849Z"`
    * `atl`: <number> All-time low price. Example: `67.81`
    * `atl_change_percentage`: <number> Percentage change from ATL. Example: `42760.77`
    * `atl_date`: <string> Date of ATL. Example: `"2013-07-06T00:00:00.000Z"`
    * `roi`: <object | null> Return on investment.
        * `times`: <number> ROI multiple. Example: `100`
        * `currency`: <string> Currency of ROI. Example: `"btc"`
        * `percentage`: <number> ROI percentage. Example: `10000`
    * `last_updated`: <string> Last updated timestamp. Example: `"2023-10-26T10:00:00.000Z"`
    * `sparkline_in_7d`: <object | undefined> Sparkline data for the last 7 days.
        * `price`: <array<number>> Array of price values.
    * `price_change_percentage_1h_in_currency`: <number | undefined> Price change percentage in the last hour.
    * `price_change_percentage_24h_in_currency`: <number | undefined> Price change percentage in the last 24 hours.
    * `price_change_percentage_7d_in_currency`: <number | undefined> Price change percentage in the last 7 days.

**Examples:**
```typescript
// Example 1: Get market data for Bitcoin in USD
const marketData = await sdk.getCoinsMarkets({ vs_currency: "usd", ids: "bitcoin" });
console.log(marketData);

// Example 2: Get market data for multiple coins with additional parameters
const marketDataWithParams = await sdk.getCoinsMarkets({
vs_currency: "usd",
ids: "bitcoin,ethereum",
category: "stablecoins",
order: "market_cap_desc",
per_page: 100,
page: 1,
sparkline: true,
price_change_percentage: "1h,24h,7d",
});
console.log(marketDataWithParams);
```