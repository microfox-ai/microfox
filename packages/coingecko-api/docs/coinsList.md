### coinsList(params)

```typescript
async coinsList(params?: CoinsListParams): Promise<CoinsListResponse>
```

**Purpose:**
Retrieves a list of all supported coins.

**Parameters:**

| Parameter | Type | Description |
|---|---|---| 
| `params` | `CoinsListParams` | Optional parameters for filtering the list. |

`CoinsListParams` is an interface:
```typescript
interface CoinsListParams {
  include_platform?: boolean; // Include platform contract addresses
  status?: 'active' | 'inactive'; // Filter by coin status, defaults to "active"
}
```

**Return Value:**

```typescript
Promise<CoinsListResponse>
```
`CoinsListResponse` is a type alias:
```typescript
type CoinsListResponse = CoinListItem[];
```
`CoinListItem` is an interface:
```typescript
interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms: Record<string, string>;
}
```

**Example:**

```typescript
const coins = await sdk.coinsList();
console.log(coins);
```