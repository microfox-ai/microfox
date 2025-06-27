## Function: `getCoinData`

Gets detailed data for a specific coin.

**Purpose:**
Retrieves comprehensive information about a cryptocurrency, including its description, links, market data, and more.

**Parameters:**
* `id`: <string> **required** The ID of the coin. Example: `"bitcoin"`
* `params`: <object | undefined>
    * `localization`: <boolean | undefined> Include localized languages. Example: `true`
    * `tickers`: <boolean | undefined> Include tickers data. Example: `true`
    * `market_data`: <boolean | undefined> Include market data. Example: `true`
    * `community_data`: <boolean | undefined> Include community data. Example: `true`
    * `developer_data`: <boolean | undefined> Include developer data. Example: `true`
    * `sparkline`: <boolean | undefined> Include sparkline data. Example: `true`

**Return Value:**
* `CoinData`: <object> Detailed coin data.
    * `id`: <string> Coin ID. Example: `"bitcoin"`
    * `symbol`: <string> Coin symbol. Example: `"btc"`
    * `name`: <string> Coin name. Example: `"Bitcoin"`
    * `asset_platform_id`: <string | null> Asset platform ID.
    * `platforms`: <object> Platform details.
    * `block_time_in_minutes`: <number> Block time in minutes.
    * `hashing_algorithm`: <string | null> Hashing algorithm.
    * `categories`: <array<string>> Coin categories.
    * `public_notice`: <string | null> Public notice.
    * `additional_notices`: <array<string>> Additional notices.
    * `localization`: <object> Localized data.
    * `description`: <object> Coin description.
    * `links`: <object> Related links.
    * `image`: <object> Image URLs.
        * `thumb`: <string> Thumbnail URL.
        * `small`: <string> Small image URL.
        * `large`: <string> Large image URL.
    * `country_origin`: <string> Country of origin.
    * `genesis_date`: <string | null> Genesis date.
    * `sentiment_votes_up_percentage`: <number> Sentiment votes up percentage.
    * `sentiment_votes_down_percentage`: <number> Sentiment votes down percentage.
    * `market_cap_rank`: <number> Market cap rank.
    * `coingecko_rank`: <number> CoinGecko rank.
    * `coingecko_score`: <number> CoinGecko score.
    * `developer_score`: <number> Developer score.
    * `community_score`: <number> Community score.
    * `liquidity_score`: <number> Liquidity score.
    * `public_interest_score`: <number> Public interest score.
    * `market_data`: <object> Market data.
    * `community_data`: <object> Community data.
    * `developer_data`: <object> Developer data.
    * `public_interest_stats`: <object> Public interest stats.
    * `status_updates`: <array<any>> Status updates.
    * `last_updated`: <string> Last updated timestamp.
    * `tickers`: <array<any>> Ticker data.

**Examples:**
```typescript
// Example 1: Get basic coin data
const coinData = await sdk.getCoinData("bitcoin");
console.log(coinData);

// Example 2: Get coin data with specific parameters
const coinDataWithParams = await sdk.getCoinData("bitcoin", {
  localization: false,
  tickers: true,
  market_data: true,
});
console.log(coinDataWithParams);
```