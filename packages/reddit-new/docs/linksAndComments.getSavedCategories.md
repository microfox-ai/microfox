## Function: `getSavedCategories`

Part of the `linksAndComments` section. Retrieves a list of categories under which the user has saved posts or comments.

**Parameters:**

- This function takes no parameters.

**Return Value:**

- `Promise<any>`: A promise that resolves to an object containing the saved categories.

**Usage Example:**

```typescript
// Example: Get all saved categories
const categories = await redditSdk.api.linksAndComments.getSavedCategories();

console.log('Saved categories:', categories);
``` 