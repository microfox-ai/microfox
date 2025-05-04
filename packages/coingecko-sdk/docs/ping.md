## Function: `ping`

Checks the status of the CoinGecko API server.

**Purpose:**

This function sends a ping request to the CoinGecko API server to verify that the server is online and responsive.

**Parameters:**

- None

**Return Value:**

- `Promise<PingResponse>`: A promise that resolves to a PingResponse object.
  - `gecko_says`: <string> API server status message.

**Examples:**

```typescript
// Example: Ping the CoinGecko API
async function checkPing() {
  const pingResponse = await sdk.ping();
  console.log(pingResponse.gecko_says);
}

checkPing();
```