## Function: `getSupportedVsCurrencies`

Gets a list of supported VS currencies.

**Purpose:**
Retrieves the list of fiat and cryptocurrencies that can be used as target currencies.

**Parameters:**
None

**Return Value:**
* `SupportedVsCurrencies` <array<string>> An array of supported currency codes.

**Examples:**
```typescript
const currencies = await sdk.getSupportedVsCurrencies();
console.log(currencies); // ['btc', 'eth', 'usd', 'eur', ...]
```