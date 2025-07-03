Gets a message by ID.

**Parameters:**

- `id`: The ID of the message to retrieve.

**Return Type:**

- `Promise<Message>`: A promise that resolves to the Message object.

**Usage Example:**

```typescript
const message = await gmailSdk.getMessage('MESSAGE_ID');
console.log(message);
```

**Code Example:**

```typescript
async function getMessageById() {
  const message = await gmailSdk.getMessage('MESSAGE_ID');
  console.log(message);
}

getMessageById();
```
