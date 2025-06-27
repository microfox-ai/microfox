## Function: `getTokenPrice`

Gets the token price of a cryptocurrency by its ID and contract address.

**Purpose:**
Fetches the current price of a specific token.

**Parameters:**
* `id`: <string> **required** The ID of the cryptocurrency. Example: `"ethereum"`
* `params`: <object> **required**
    * `contract_addresses`: <string> **required** Comma-separated list of contract addresses. Example: `"0x...`
    * `vs_currencies`: <string> **required** Comma-separated list of target currencies. Example: `"usd,eur,btc"`
    * `include_market_cap`: <boolean | undefined> Include market cap. Example: `true`
    * `include_24hr_vol`: <boolean | undefined> Include 24hr volume. Example: `true`
    * `include_24hr_change`: <boolean | undefined> Include 24hr change. Example: `true`
    * `include_last_updated_at`: <boolean | undefined> Include last updated timestamp. Example: `true`
    * `precision`: <string | undefined> Decimal places for price. Example: `"2"`

**Return Value:**
* `SimplePrice` <object> An object where keys are contract addresses and values are objects containing prices in different currencies.

**Examples:**
```typescript
const price = await sdk.getTokenPrice("ethereum", { contract_addresses: "0x...", vs_currencies: "usd" });
console.log(price);
```