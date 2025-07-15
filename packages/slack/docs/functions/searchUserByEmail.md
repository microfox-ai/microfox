# searchUserByEmail

The `searchUserByEmail` method finds a user by their email address.

## Arguments

| Name  | Type   | Description                          |
|-------|--------|--------------------------------------|
| email | string | The email address of the user to find. |

## Returns

This method returns a `User` object, which contains details about the user.

## Example

```typescript
const user = await client.searchUserByEmail('name@example.com');
console.log(user);
``` 