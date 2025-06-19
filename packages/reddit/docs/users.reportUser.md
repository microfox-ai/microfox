## Function: `reportUser`

Reports a user.

**Parameters:**

- `user` (string): The username of the user to report.
- `reason` (string): The reason for the report (max 100 characters).
- `details` (string, optional): Additional details for the report.

**Return Value:**

- `Promise<void>`: A promise that resolves when the report is submitted.

**Usage Examples:**

```typescript
// Report a user for spam
await reddit.api.users.reportUser({
  user: 'some_spammer',
  reason: 'Spamming',
  details: 'This user is posting spam links.',
});
console.log('User has been reported.');
```
