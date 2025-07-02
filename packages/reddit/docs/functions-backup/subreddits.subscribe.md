## Function: `subscribe`

Part of the `subreddits` section. Subscribe to or unsubscribe from a subreddit.

**Parameters:**

- `action` (string): The action to perform: 'sub' for subscribe, 'unsub' for unsubscribe.
- `sr_name` (string): The name of the subreddit to subscribe to.
- `sr` (string, optional): The fullname of the subreddit.
- `action_source` (string, optional): The source of the action, e.g., 'onboarding'.
- `skip_initial_defaults` (boolean, optional): Skip initial defaults.

**Return Value:**

- `Promise<void>`: A promise that resolves when the action is complete.

**Usage Examples:**

```typescript
// Subscribe to the 'learnprogramming' subreddit
await reddit.api.subreddits.subscribe({
  action: 'sub',
  sr_name: 'learnprogramming',
});
console.log('Subscribed to r/learnprogramming.');
```

```typescript
// Unsubscribe from the 'reactjs' subreddit
await reddit.api.subreddits.subscribe({
  action: 'unsub',
  sr_name: 'reactjs',
});
console.log('Unsubscribed from r/reactjs.');
```
