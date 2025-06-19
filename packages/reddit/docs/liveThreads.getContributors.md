## Function: `getContributors`

Retrieves a list of contributors for a specific live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.

**Return Value:**

- `Promise<Listing<User>>`: A promise that resolves to a listing of user objects.

**User Type:**

The `User` object has the same structure as the one from the `getMe` function in the `account` section. Please refer to the `account.getMe.md` documentation for the detailed `User` type definition.

**Usage Examples:**

```typescript
// Get the contributors for a live thread
const contributors = await reddit.api.liveThreads.getContributors({
  threadId: 'some_thread_id',
});
console.log(contributors);
```
