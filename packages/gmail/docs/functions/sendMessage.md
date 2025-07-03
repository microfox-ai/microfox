Sends a message.

**Parameters:**

- `message`: The Message object to send.

**Return Type:**

- `Promise<Message>`: A promise that resolves to the sent Message object.

**Usage Example:**

```typescript
const sentMessage = await gmailSdk.sendMessage(message);
console.log(sentMessage);
```

**Code Example:**

```typescript
async function sendMessageObject() {
  const sentMessage = await gmailSdk.sendMessage(message);
  console.log(sentMessage);
}

sendMessageObject();
```
