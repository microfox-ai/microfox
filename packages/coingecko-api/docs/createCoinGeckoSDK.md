### createCoinGeckoSDK(apiKey)

```typescript
export function createCoinGeckoSDK(apiKey: string): CoinGeckoSdk
```

**Purpose:**
Creates a new instance of the `CoinGeckoSdk`.

**Parameters:**

| Parameter | Type | Description |
|---|---|---| 
| `apiKey` | `string` | Your CoinGecko Pro API key. |

**Return Value:**

```typescript
CoinGeckoSdk
```
An instance of the CoinGeckoSdk class.

**Example:**

```typescript
import { createCoinGeckoSDK } from 
'@microfox/coingecko-api';

const apiKey = process.env.COINGECKO_API_KEY;
const sdk = createCoinGeckoSDK(apiKey);
```