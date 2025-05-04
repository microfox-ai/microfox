### CoinGeckoSdk Constructor

```typescript
constructor(apiKey: string)
```

**Purpose:**
Initializes a new instance of the `CoinGeckoSdk` with the given API key.

**Parameters:**

| Parameter | Type | Description |
|---|---|---| 
| `apiKey` | `string` | Your CoinGecko Pro API key. |

**Example:**

```typescript
import { createCoinGeckoSDK } from 
'@microfox/coingecko-api';

const apiKey = process.env.COINGECKO_API_KEY;
const sdk = createCoinGeckoSDK(apiKey);
```