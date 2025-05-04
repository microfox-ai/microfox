## Function: `getCoinsList`

Retrieves a list of all supported coins.

**Purpose:**

This function fetches a list of all coins supported by CoinGecko, including their IDs, symbols, and names.

**Parameters:**

- `params`: <object> (Optional) An object containing the request parameters.
  - `include_platform`: <boolean> (Optional) Include platform and contract addresses.
  - `status`: <enum> (Optional) Filter by coin status. Possible values: "active", "inactive".

**Return Value:**

- `Promise<CoinListEntry[]>`: A promise that resolves to an array of CoinListEntry objects.
  - `CoinListEntry`: <object>
    - `id`: <string> Coin ID.
    - `symbol`: <string> Coin symbol.
    - `name`: <string> Coin name.
    - `platforms`: <object> (Optional) Contract addresses for various platforms. This field is present only if `include_platform` is set to `true`.

**Examples:**

```typescript
// Example 1: Get the list of all coins
async function getAllCoins() {
  const coinList = await sdk.getCoinsList();
  console.log(coinList);
}

getAllCoins();

// Example 2: Get the list of coins with platform information
async function getCoinsWithPlatforms() {
  const coinList = await sdk.getCoinsList({ include_platform: true });
  console.log(coinList);
}

getCoinsWithPlatforms();
```