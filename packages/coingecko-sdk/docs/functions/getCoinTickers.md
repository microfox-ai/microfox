## Function: `getCoinTickers`

Gets ticker data for a specific coin.

**Purpose:**
Retrieves ticker information for a cryptocurrency, including price, volume, and exchange data.

**Parameters:**
* `id`: <string> **required** The ID of the coin. Example: `"bitcoin"`
* `params`: <object | undefined>
    * `exchange_ids`: <string | undefined> Filter by exchange IDs (comma-separated). Example: `"binance,coinbase"`
    * `include_exchange_logo`: <string | undefined> Include exchange logos. Example: `"true"`
    * `page`: <number | undefined> Page number. Example: `1`
    * `order`: <string | undefined> Sort order (e.g., `"volume_desc"`). Example: `"volume_desc"`
    * `depth`: <string | undefined> Order book depth. Example: `"true"`

**Return Value:**
* `CoinTickers`: <object> Ticker data.
    * `name`: <string> Coin name. Example: `"Bitcoin"`
    * `tickers`: <array<object>> Array of ticker objects.
        * `base`: <string> Base currency. Example: `"BTC"`
        * `target`: <string> Target currency. Example: `"USD"`
        * `market`: <object> Market information.
            * `name`: <string> Market name. Example: `"Binance"`
            * `identifier`: <string> Market identifier. Example: `"binance"`
            * `has_trading_incentive`: <boolean> Has trading incentive.
        * `last`: <number> Last traded price. Example: `29000`
        * `volume`: <number> Trading volume. Example: `15000000000`
        * `converted_last`: <object> Converted last traded price.
        * `converted_volume`: <object> Converted trading volume.
        * `trust_score`: <string> Trust score. Example: `"green"`
        * `bid_ask_spread_percentage`: <number> Bid-ask spread percentage. Example: `0.1`
        * `timestamp`: <string> Timestamp. Example: `"2023-10-26T10:00:00.000Z"`
        * `last_traded_at`: <string> Last traded at timestamp. Example: `"2023-10-26T10:00:00.000Z"`
        * `last_fetch_at`: <string> Last fetch at timestamp. Example: `"2023-10-26T10:00:00.000Z"`
        * `is_anomaly`: <boolean> Is anomaly.
        * `is_stale`: <boolean> Is stale.
        * `trade_url`: <string | null> Trade URL.
        * `token_info_url`: <string | null> Token info URL.
        * `coin_id`: <string> Coin ID. Example: `"bitcoin"`
        * `target_coin_id`: <string | undefined> Target coin ID.

**Examples:**
```typescript
// Example 1: Get all tickers for Bitcoin
const tickers = await sdk.getCoinTickers("bitcoin");
console.log(tickers);

// Example 2: Get tickers with specific parameters
const tickersWithParams = await sdk.getCoinTickers("bitcoin", {
  exchange_ids: "binance,coinbase",
  include_exchange_logo: "true",
  page: 1,
  order: "volume_desc",
});
console.log(tickersWithParams);
```