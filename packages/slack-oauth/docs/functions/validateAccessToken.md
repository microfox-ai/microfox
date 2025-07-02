## Function: `validateAccessToken`

Validates a Slack access token.

**Purpose:**
Checks if a given access token is valid.

**Parameters:**

- `token`: string - The access token to validate. **Required.**

**Return Value:**

- `Promise<SlackTokenResponse>` - A promise that resolves to an object containing the validation results.

  - `ok`: boolean - Indicates whether the token is valid.
  - `url`: string - The URL of the team.
  - `team`: string - The name of the team.
  - `user`: string - The name of the user.
  - `team_id`: string - The ID of the team.
  - `user_id`: string - The ID of the user.

**Examples:**

```typescript
// Example usage
try {
  const validationResponse = await slackOAuth.validateAccessToken('YOUR_TOKEN');
  console.log(validationResponse);
} catch (error) {
  console.error('Error validating token:', error);
}
```
