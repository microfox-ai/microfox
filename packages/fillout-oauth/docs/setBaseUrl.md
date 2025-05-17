## Function: `setBaseUrl`

Sets the base URL for API requests.

**Purpose:**
This function allows you to customize the base URL used for making API requests.

**Parameters:**

- `url`: string (required)
  - The new base URL. Must be a valid URL.

**Return Value:**

- `void`

**Examples:**

```typescript
// Example: Setting the base URL
filloutOAuth.setBaseUrl("https://new.api.fillout.com");
```