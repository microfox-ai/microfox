## Function: `changePhone`

Changes the phone number associated with the account.

**Purpose:**
This function changes the phone number associated with the account.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `params` | `ChangePhoneParams` | Yes | An object containing the new phone number and related information. |

**`ChangePhoneParams` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `phone_number` | `string` | Yes | New phone number. |
| `phone_code_hash` | `string` | Yes | Phone code hash. |
| `phone_code` | `string` | Yes | Phone code. |

**Return Value:**

`Promise<ApiResponse<any>>` - A promise that resolves to an ApiResponse object containing the result of the changePhone operation.

**`ApiResponse<any>` Type:**

| Field | Type | Description |
|---|---|---| 
| `ok` | `boolean` | Indicates whether the request was successful. |
| `result` | `any` | The result of the request, if successful. |

**Examples:**

```typescript
const result = await sdk.account.changePhone({
  phone_number: '+15551234567',
  phone_code_hash: 'phone_code_hash',
  phone_code: 'phone_code',
});
```