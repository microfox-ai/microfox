Lists threads matching the specified query parameters.

**Parameters:**

- `params` (optional): An object with the following properties:
  - `q`: A search query string.
  - `pageToken`: A page token to retrieve the next page of results.
  - `maxResults`: The maximum number of results to return.

**Return Type:**

- `Promise<ListThreadsResponse>`: A promise that resolves to a ListThreadsResponse object containing an array of threads.

**Usage Example:**

```typescript
const threads = await gmailSdk.listThreads({ q: 'from:me' });
console.log(threads);
```

**Code Example:**

```typescript
async function listThreadsByQuery() {
  const threads = await gmailSdk.listThreads({ q: 'from:me' });
  console.log(threads);
}

listThreadsByQuery();
```
