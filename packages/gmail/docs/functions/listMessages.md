Lists messages matching the specified query parameters.

**Parameters:**

- `params` (optional): An object with the following properties:
  - `q`: A search query string.
  - `pageToken`: A page token to retrieve the next page of results.
  - `maxResults`: The maximum number of results to return.

**Return Type:**

- `Promise<ListMessagesResponse>`: A promise that resolves to a ListMessagesResponse object containing an array of messages.

**Usage Example:**

```typescript
const messages = await gmailSdk.listMessages({ q: 'from:me' });
console.log(messages);
```

**Code Example:**

```typescript
async function listMessagesByQuery() {
  const messages = await gmailSdk.listMessages({ q: 'from:me' });
  console.log(messages);
}

listMessagesByQuery();
```
