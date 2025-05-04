## Function: `checkApiUsage`

Checks the current API key usage.

**Purpose:**

This function retrieves the current usage statistics for the provided API key, including the number of credits used and remaining.

**Parameters:**

- None

**Return Value:**

- `Promise<UsageResponse>`: A promise that resolves to a UsageResponse object.
  - `status`: <string> API usage status.
  - `data`: <object>
    - `credits_used`: <number> Number of credits used.
    - `credits_remaining`: <number> Number of credits remaining.

**Examples:**

```typescript
// Example: Check API usage
async function checkUsage() {
  const usageResponse = await sdk.checkApiUsage();
  console.log(usageResponse);
}

checkUsage();
```