## Function: `ping`

Tests the CoinGecko API connection.

**Purpose:**
Checks if the API is reachable and responding.

**Parameters:**
None

**Return Value:**

* <object>
    * `gecko_says`: <string> A message from the API.

**Examples:**

```typescript
const result = await sdk.ping();
console.log(result.gecko_says);
```