## Function: `getMyPrefs`

Part of the `account` section. Gets the preferences for the currently authenticated user.

**Parameters:**

- `params`: object (optional)
  - An object containing a list of preference fields to return.
  - `fields`: string[] - A list of preference fields to return. If not provided, all preferences are returned. Refer to the official Reddit API documentation for a complete list of possible fields.

**Return Value:**

- `Promise<any>`: A promise that resolves to an object containing the user's preferences. The structure of this object is dynamic based on the requested fields.

**Usage Example:**

```typescript
// Example: Get all preferences
const allPrefs = await redditSdk.api.account.getMyPrefs();
console.log(allPrefs);

// Example: Get specific preferences
const specificPrefs = await redditSdk.api.account.getMyPrefs({
  fields: ['lang', 'nightmode', 'over_18']
});
console.log(specificPrefs);
``` 