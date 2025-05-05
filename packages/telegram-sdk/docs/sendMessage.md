## Function: `sendMessage`

Sends a text message to a specified chat.

**Purpose:**
This function allows you to send text messages to Telegram chats.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `params` | `SendMessageParams` | Yes | An object containing the chat ID and message text. |

**`SendMessageParams` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `chat_id` | `number` | Yes | The ID of the chat to send the message to. |
| `text` | `string` | Yes | The text of the message to send. |

**Return Value:**

`Promise<ApiResponse<any>>` - A promise that resolves to an ApiResponse object containing the result of the sendMessage operation.

**`ApiResponse<any>` Type:**

| Field | Type | Description |
|---|---|---| 
| `ok` | `boolean` | Indicates whether the request was successful. |
| `result` | `any` | The result of the request, if successful. |

**Examples:**

```typescript
const result = await sdk.messages.sendMessage({
  chat_id: 123456789,
  text: 'Hello, world!',
});
```