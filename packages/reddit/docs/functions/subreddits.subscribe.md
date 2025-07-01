## Function: `subscribe`

Subscribes to or unsubscribes from a subreddit.

**Parameters:**

- `action`: "sub" | "unsub" - The action to perform.
- `sr_name`: string - The name of the subreddit to subscribe to or unsubscribe from.

**Return Type:**

- `Promise<void>`: A promise that resolves when the action is complete.

**Usage Example:**

```typescript
// Subscribe to a subreddit
await reddit.subreddits.subscribe({ action: 'sub', sr_name: 'learnprogramming' });

// Unsubscribe from a subreddit
await reddit.subreddits.subscribe({ action: 'unsub', sr_name: 'learnprogramming' });
```

**Code Example:**

```typescript
async function manageSubscription(subreddit, shouldSubscribe) {
  const action = shouldSubscribe ? 'sub' : 'unsub';
  try {
    await reddit.subreddits.subscribe({ action: action, sr_name: subreddit });
    console.log(`Successfully performed '${action}' action on r/${subreddit}.`);
  } catch (error) {
    console.error(`Failed to ${action} to r/${subreddit}:`, error);
  }
}

// Example: Subscribe
manageSubscription('corgi', true);

// Example: Unsubscribe
// manageSubscription('corgi', false);
``` 