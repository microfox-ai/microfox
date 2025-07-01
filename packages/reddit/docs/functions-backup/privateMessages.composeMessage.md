## Function: `composeMessage`

Part of the `privateMessages` section. Compose a private message.

**Parameters:**

- `api_type` ('json', optional): Must be 'json'.
- `from_sr` (string, optional): Subreddit name to message from.
- `g-recaptcha-response` (string, optional): The recaptcha response.
- `subject` (string): The subject of the message (max 100 characters).
- `text` (string): The message text.
- `to` (string): The name of an existing user to send the message to.

**Return Value:**

- `Promise<void>`: A promise that resolves when the request is complete.

**Usage Examples:**

```typescript
// 1. Send a simple private message to a user
await reddit.api.privateMessages.composeMessage({
  to: 'someuser',
  subject: 'Hello!',
  text: 'Just wanted to say hi.',
  api_type: 'json',
});
console.log('Message sent successfully.');
```

```typescript
// 2. Send a message on behalf of a subreddit you moderate
await reddit.api.privateMessages.composeMessage({
  to: 'someuser',
  from_sr: 'some_subreddit_i_moderate',
  subject: 'A message from r/some_subreddit_i_moderate',
  text: 'This is an official message.',
  api_type: 'json',
});
console.log('Message sent on behalf of the subreddit.');
```
