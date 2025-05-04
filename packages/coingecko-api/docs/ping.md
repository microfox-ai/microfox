### ping()

```typescript
async ping(): Promise<PingResponse>
```

**Purpose:**
Checks the API connection status.

**Parameters:**
None

**Return Value:**

```typescript
Promise<PingResponse>
```
`PingResponse` is an interface:
```typescript
interface PingResponse {
  gecko_says: string;
}
```

**Example:**

```typescript
const pingResult = await sdk.ping();
console.log(pingResult.gecko_says);
```