## Function: `checkUsername`

Checks whether a username is available.

**Purpose:**
This function checks whether a username is available.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `params` | `CheckUsernameParams` | Yes | An object containing the username to check. |

**`CheckUsernameParams` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `username` | `string` | Yes | Username to check. |

**Return Value:**

`Promise<ApiResponse<boolean>>` - A promise that resolves to an ApiResponse object containing a boolean indicating whether the username is available.

**`ApiResponse<boolean>` Type:**

| Field | Type | Description |
|---|---|---| 
| `ok` | `boolean` | Indicates whether the request was successful. |
| `result` | `boolean` | True if the username is available, false otherwise. |

**Examples:**

```typescript
const result = await sdk.account.checkUsername({
  username: 'test_username',
});
```