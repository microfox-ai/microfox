## Constructor: `createSESSdk`

Creates an instance of the AWS SES SDK. This function configures and returns an object with methods for sending emails via the AWS SES service.

**Parameters:**

- `config`: SESConfig - Required. AWS SES configuration object.

  - `accessKeyId`: string - Required. AWS access key ID. This is a string value.
  - `secretAccessKey`: string - Required. AWS secret access key. This is a string value.
  - `region`: string - Required. AWS region where SES is configured (e.g., "us-east-1"). This is a string value.

**Return Value:**

- `SESSDK` - An object containing the `sendEmail` and `sendBulkEmails` functions.


**Examples:**

```typescript
// Example: Creating an SDK instance
const ses = createSESSdk({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});
```
