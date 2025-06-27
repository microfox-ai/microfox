Gets a thread by ID.

**Parameters:**

- `id`: The ID of the thread to retrieve.

**Return Type:**

- `Promise<Thread>`: A promise that resolves to the Thread object.

**Usage Example:**

```typescript
const thread = await gmailSdk.getThread('THREAD_ID');
console.log(thread);
```

**Code Example:**

```typescript
async function getThreadById() {
  const thread = await gmailSdk.getThread('THREAD_ID');
  console.log(thread);
}

getThreadById();
```
