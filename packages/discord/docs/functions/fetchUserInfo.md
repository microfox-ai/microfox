## Function: `fetchUserInfo`

Fetches information about a user.

**Purpose:**
Retrieves details about a specific user, such as their username, avatar, and discriminator.

**Parameters:**

- `userId`: string - The ID of the user to fetch information about.

**Return Value:**
A `Promise` that resolves to a user object containing information about the user.

**Examples:**

```typescript
const user = await discordSdk.fetchUserInfo('1234567890');
```
