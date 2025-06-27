## Function: `getCoinsList`

Gets a list of all supported coins.

**Purpose:**
Fetches a list of all available cryptocurrencies with their IDs, symbols, and names.

**Parameters:**
* `params`: <object | undefined>
    * `include_platform`: <boolean | undefined> Include platform and contract addresses. Default: `false`
    * `status`: <string | undefined> Filter by coin status (`'active'` or `'inactive'`). Default: `'active'`

**Return Value:**
* `CoinList` <array<object>> An array of coin list items.
    * `id`: <string> Coin ID. Example: `"bitcoin"`
    * `symbol`: <string> Coin symbol. Example: `"btc"`
    * `name`: <string> Coin name. Example: `"Bitcoin"`
    * `platforms`: <object | undefined> An object mapping platform IDs to contract addresses.

**Examples:**
```typescript
// Example 1: Get list of all active coins
const coins = await sdk.getCoinsList();
console.log(coins);

// Example 2: Include platform information
const coinsWithPlatforms = await sdk.getCoinsList({ include_platform: true });
console.log(coinsWithPlatforms);
```