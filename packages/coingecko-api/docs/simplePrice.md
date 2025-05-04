### simplePrice(params)

```typescript
async simplePrice(params: SimplePriceParams): Promise<SimplePriceResponse>
```

**Purpose:**
Retrieves simple price data for the specified cryptocurrencies in the requested currencies.

**Parameters:**

| Parameter | Type | Description |
|---|---|---| 
| `params` | `SimplePriceParams` | An object containing the request parameters. |

`SimplePriceParams` is an interface:
```typescript
interface SimplePriceParams {
  vs_currencies: string; // Required comma-separated currency codes (e.g., "usd,eur")
  ids?: string; // Comma-separated coin IDs
  names?: string; // Comma-separated coin names (URL-encoded spaces)
  symbols?: string; // Comma-separated coin symbols
  include_tokens?: 'all' | 'top'; // For symbol lookup, defaults to "top"
  include_market_cap?: boolean; // Include market cap data
  include_24hr_vol?: boolean; // Include 24-hour volume data
  include_24hr_change?: boolean; // Include 24-hour price change data
  include_last_updated_at?: boolean; // Include last updated timestamp
  precision?: string; // "full" or number of decimal places (0-18)
}
```

**Return Value:**

```typescript
Promise<SimplePriceResponse>
```
`SimplePriceResponse` is a type alias:
```typescript
type SimplePriceResponse = Record<string, Record<string, number | null>>;
```
This represents a dictionary where keys are cryptocurrency IDs and values are dictionaries of currency codes to prices.

**Example:**

```typescript
const priceData = await sdk.simplePrice({ vs_currencies: "usd", ids: "bitcoin" });
console.log(priceData);
```