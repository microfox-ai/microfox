## Function: `composeMessage`

Sends a private message to another Reddit user.

**Parameters:**

- `to`: string - The username of the recipient.
- `subject`: string - The subject line of the message.
- `text`: string - The body of the message.
- `from_sr`: string (optional) - The subreddit from which the message is sent.

**Return Type:**

- `Promise<void>`: A promise that resolves when the message has been sent successfully.

**Usage Example:**

```typescript
await reddit.privateMessages.composeMessage({
  to: 'some_username',
  subject: 'Hello!',
  text: 'This is a test message from the Microfox Reddit SDK.'
});
```

**Code Example:**

```typescript
async function sendMessage(recipient, subject, body) {
  try {
    await reddit.privateMessages.composeMessage({
      to: recipient,
      subject: subject,
      text: body,
    });
    console.log(`Message sent successfully to ${recipient}.`);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

sendMessage('some_user_here', 'Greetings', 'Just wanted to say hi!');
```  
