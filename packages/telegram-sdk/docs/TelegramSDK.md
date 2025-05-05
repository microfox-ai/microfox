## Constructor: `TelegramSDK`

Initializes a new instance of the TelegramSDK.

**Purpose:**
This constructor sets up the necessary API credentials for interacting with the Telegram API.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `options` | `TelegramSDKOptions` | Yes | An object containing the API ID and API hash. |

**`TelegramSDKOptions` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `apiId` | `string` | Yes | Your Telegram API ID. |
| `apiHash` | `string` | Yes | Your Telegram API hash. |

**Return Value:**

`TelegramSDK` - An instance of the TelegramSDK class.

**Examples:**

```typescript
const sdk = new TelegramSDK({
  apiId: process.env.TELEGRAM_API_ID,
  apiHash: process.env.TELEGRAM_API_HASH,
});
```