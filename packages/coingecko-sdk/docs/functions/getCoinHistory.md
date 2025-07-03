## Function: `getCoinHistory`

Gets historical data for a specific coin.

**Purpose:**
Retrieves historical market data for a cryptocurrency on a specific date.

**Parameters:**
* `id`: <string> **required** The ID of the coin. Example: `"bitcoin"`
* `params`: <object> **required**
    * `date`: <string> **required** Date in YYYY-MM-DD format. Example: `"2022-10-26"`
    * `localization`: <string | undefined> Set to `"false"` to exclude localized languages in response. Example: `"false"`

**Return Value:**
* `CoinHistory`: <object> Historical coin data.
    * `id`: <string> Coin ID. Example: `"bitcoin"`
    * `symbol`: <string> Coin symbol. Example: `"btc"`
    * `name`: <string> Coin name. Example: `"Bitcoin"`
    * `localization`: <object> Localized data.
    * `image`: <object> Image URLs.
        * `thumb`: <string> Thumbnail URL.
        * `small`: <string> Small image URL.
    * `market_data`: <object> Market data.
        * `current_price`: <object> Current price in different currencies.
        * `market_cap`: <object> Market cap in different currencies.
        * `total_volume`: <object> Total volume in different currencies.
    * `community_data`: <object> Community data.
    * `developer_data`: <object> Developer data.
    * `public_interest_stats`: <object> Public interest stats.

**Examples:**
```typescript
const history = await sdk.getCoinHistory("bitcoin", { date: "2022-10-26" });
console.log(history);
```