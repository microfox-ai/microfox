### coinsMarkets(params)

```typescript
async coinsMarkets(params: CoinsMarketsParams): Promise<CoinsMarketsResponse>
```

**Purpose:**
Retrieves market data for the specified cryptocurrencies.

**Parameters:**

| Parameter | Type | Description |
|---|---|---| 
| `params` | `CoinsMarketsParams` | An object containing the request parameters. |

`CoinsMarketsParams` is an interface:
```typescript
interface CoinsMarketsParams {
  vs_currency: string; // Required target currency of market data (usd, eur, jpy, etc.)
  ids?: string; // Comma-separated coin IDs
  category?: string; // Filter by coin category
  order?: string; // Sort results by field (market_cap_desc, gecko_desc, gecko_asc, market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc)
  per_page?: number; // Total results per page
  page?: number; // Page through results
  sparkline?: boolean; // Include sparkline 7 days data
  price_change_percentage?: string; // Include price change percentage in 1h, 24h, 7d, 14d, 30d, 200d, 1y (eg. "1h,24h,7d")
}
```

**Return Value:**

```typescript
Promise<CoinsMarketsResponse>
```
`CoinsMarketsResponse` is a type alias:
```typescript
type CoinsMarketsResponse = CoinsMarketsItem[];
```
`CoinsMarketsItem` is a complex interface (refer to src/types/index.ts for full definition).

**Example:**

```typescript
const marketData = await sdk.coinsMarkets({ vs_currency: "usd", ids: "bitcoin" });
console.log(marketData);
```