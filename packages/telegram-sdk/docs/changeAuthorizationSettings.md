## Function: `changeAuthorizationSettings`

Changes the authorization settings.

**Purpose:**
This function changes the authorization settings.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `params` | `ChangeAuthorizationSettingsParams` | Yes | An object containing the new authorization settings. |

**`ChangeAuthorizationSettingsParams` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `hash` | `number` | Yes | Hash. |
| `flags` | `number` | Yes | Flags. |
| `app_version` | `string` | No | Application version. |
| `device_model` | `string` | No | Device model. |
| `system_version` | `string` | No | System version. |
| `system_language_code` | `string` | No | System language code. |
| `lang_pack` | `string` | No | Language pack. |
| `lang_code` | `string` | No | Language code. |
| `enable_animated_emojis` | `boolean` | No | Enable animated emojis. |
| `enable_animated_stickers` | `boolean` | No | Enable animated stickers. |

**Return Value:**

`Promise<ApiResponse<boolean>>` - A promise that resolves to an ApiResponse object containing a boolean indicating whether the settings were changed successfully.

**`ApiResponse<boolean>` Type:**

| Field | Type | Description |
|---|---|---| 
| `ok` | `boolean` | Indicates whether the request was successful. |
| `result` | `boolean` | True if the settings were changed successfully, false otherwise. |

**Examples:**

```typescript
const result = await sdk.account.changeAuthorizationSettings({
  hash: 1234,
  flags: 0,
});

const result2 = await sdk.account.changeAuthorizationSettings({
  hash: 1234,
  flags: 0,
  app_version: '1.0.0',
  device_model: 'Device Model',
  system_version: 'System Version',
  system_language_code: 'en',
  lang_pack: 'Lang Pack',
  lang_code: 'en',
  enable_animated_emojis: true,
  enable_animated_stickers: true,
});
```