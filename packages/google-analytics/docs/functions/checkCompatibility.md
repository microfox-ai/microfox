## Function: `checkCompatibility`

Checks compatibility.

**Purpose:**

Checks the compatibility of report parameters.

**Parameters:**

- `property`: string - The property ID to check.
- `request`: CheckCompatibilityRequest - The compatibility request parameters.

**Return Value:**

- `Promise<CheckCompatibilityResponse>` - A promise that resolves to the compatibility response.

**Examples:**

```typescript
// Example: Check compatibility
const response = await sdk.checkCompatibility('properties/<propertyId>', {
  metrics: [{ name: 'sessions' }],
  dimensions: [{ name: 'country' }],
});
console.log(response);
```
