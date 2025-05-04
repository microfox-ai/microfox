### checkApiKeyUsage()

```typescript
async checkApiKeyUsage(): Promise<KeyUsageResponse>
```

**Purpose:**
Retrieves the current month's API key usage and limit.

**Parameters:**
None

**Return Value:**

```typescript
Promise<KeyUsageResponse>
```
`KeyUsageResponse` is an interface:
```typescript
interface KeyUsageResponse {
  usage: {
    current_month: number;
    limit: number;
  };
}
```

**Example:**

```typescript
const usage = await sdk.checkApiKeyUsage();
console.log(usage.usage.current_month, usage.usage.limit);
```