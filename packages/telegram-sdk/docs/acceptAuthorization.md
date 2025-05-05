## Function: `acceptAuthorization`

Accepts an authorization request.

**Purpose:**
This function accepts an authorization request.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `params` | `AcceptAuthorizationParams` | Yes | An object containing the authorization parameters. |

**`AcceptAuthorizationParams` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `form_id` | `number` | Yes | Authorization form ID. |
| `flags` | `number` | Yes | Flags. |
| `public_key` | `string` | Yes | Public key. |
| `nonce` | `string` | Yes | Nonce. |
| `encrypted_data` | `string` | Yes | Encrypted data. |

**Return Value:**

`Promise<ApiResponse<boolean>>` - A promise that resolves to an ApiResponse object containing a boolean indicating whether the authorization was accepted.

**`ApiResponse<boolean>` Type:**

| Field | Type | Description |
|---|---|---| 
| `ok` | `boolean` | Indicates whether the request was successful. |
| `result` | `boolean` | True if the authorization was accepted, false otherwise. |

**Examples:**

```typescript
const result = await sdk.account.acceptAuthorization({
  form_id: 1234,
  flags: 0,
  public_key: 'public_key',
  nonce: 'nonce',
  encrypted_data: 'encrypted_data',
});
```