## Function: `needsCaptcha`

Part of the `captcha` section. Checks if a CAPTCHA is required for an action.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<boolean>`: A promise that resolves to `true` if a CAPTCHA is required, and `false` otherwise.

**Usage Example:**

```typescript
// Example: Check if a CAPTCHA is needed
const isCaptchaRequired = await redditSdk.api.captcha.needsCaptcha();
if (isCaptchaRequired) {
  console.log('A CAPTCHA is required to proceed.');
  // Logic to handle CAPTCHA would go here
} else {
  console.log('No CAPTCHA required.');
}
``` 