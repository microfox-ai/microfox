### request<T>(endpoint, params)

```typescript
private async request<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T>
```

**Purpose:**
Makes a request to the specified CoinGecko API endpoint with optional parameters and returns the parsed JSON response.

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `endpoint` | `string` | The API endpoint path relative to the base URL. |
| `params` | `Record<string, string | number | boolean>` | Optional parameters to include in the request query string. |

**Return Value:**

```typescript
Promise<T>
```
A Promise that resolves to the parsed JSON response of type T.

**Example:**

```typescript
// This method is private and not meant to be called directly.
```