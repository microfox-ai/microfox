## Function: `getUsers`

Gets a list of users.

**Purpose:**
This function retrieves a list of users based on their IDs.

**Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---| 
| `params` | `GetUsersParams` | Yes | An object containing an array of user IDs. |

**`GetUsersParams` Type:**

| Field | Type | Required | Description |
|---|---|---|---| 
| `id` | `array<number>` | Yes | Array of user IDs. |

**Return Value:**

`Promise<ApiResponse<any[]>>` - A promise that resolves to an ApiResponse object containing an array of user objects.

**`ApiResponse<any[]>` Type:**

| Field | Type | Description |
|---|---|---| 
| `ok` | `boolean` | Indicates whether the request was successful. |
| `result` | `any[]` | An array of user objects, if successful. |

**Examples:**

```typescript
const result = await sdk.users.getUsers({
  id: [123, 456, 789],
});
```