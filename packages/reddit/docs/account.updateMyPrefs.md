## Function: `updateMyPrefs`

Part of the `account` section. Updates the preferences for the currently authenticated user.

**Parameters:**

- `params`: object
  - An object containing the preference fields to update. The structure is based on the `UpdatePrefs` type, where all fields are optional.

**Return Value:**

- `Promise<any>`: A promise that resolves to the updated preferences object.

**UpdatePrefs Type:**

The `UpdatePrefs` object can contain a wide variety of fields to update user preferences. All fields are optional. Here is a small subset of the available fields:

```typescript
export interface UpdatePrefs {
  accept_pms?: 'everyone' | 'whitelisted';
  beta?: boolean;
  country_code?: string; // e.g., 'US', 'CA', 'GB'
  default_comment_sort?: 'confidence' | 'top' | 'new' | 'controversial' | 'old' | 'random' | 'qa' | 'live';
  email_digests?: boolean;
  enable_followers?: boolean;
  hide_ads?: boolean;
  lang?: string; // e.g., 'en', 'es', 'fr'
  nightmode?: boolean;
  over_18?: boolean;
  // ... and many more preference fields.
}
```

For a complete list of all available preference fields, please refer to the official Reddit API documentation.

**Usage Example:**

```typescript
// Example: Update user preferences
const updatedPrefs = await redditSdk.api.account.updateMyPrefs({
  lang: 'fr',
  nightmode: true,
  over_18: true,
});

console.log('Preferences updated:', updatedPrefs);
``` 