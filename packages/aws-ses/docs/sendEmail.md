## Function: `sendEmail`

Sends a single email using the provided parameters.

**Purpose:**

This function sends a single email to a specified recipient using the AWS SES service.

**Parameters:**

- `params`: EmailParams - Required. Parameters for sending the email.

  - `sender`: string - Required. Email address of the sender (must be verified in AWS SES). This is a string value in email format.
  - `recipient`: string - Required. Email address of the recipient. This is a string value in email format.
  - `displayName`: string | undefined - Optional. Display name for the sender (e.g., "John Doe" <john@example.com>). This is a string value.
  - `subject`: string - Required. Subject line of the email. This is a string value.
  - `bodyText`: string | undefined - Optional. Plain text version of the email body. This is a string value.
  - `bodyHtml`: string | undefined - Optional. HTML version of the email body. This is a string value.

**Return Value:**

- `Promise<SendEmailResponse>` - A promise that resolves to the SendEmailResponse object.

  - `SendEmailResponse`: object - The response from the AWS SES API.

    - `SendEmailResult`: object - The result of the SendEmail operation.

      - `MessageId`: string - The unique identifier for the sent email. This is a string value.

    - `ResponseMetadata`: object - Metadata about the AWS SES API request.

      - `RequestId`: string - The unique request identifier. This is a string value.

**Examples:**

```typescript
// Example 1: Sending a plain text email
await ses.sendEmail({
  // sender will be like service@reply-bots.com
  sender:
    req.params.senderSubDomain + '@' + process.env.AWS_SES_SENDER_MAIL_DOMAIN ??
    'sender@example.com',
  recipient:
    process.env.AWS_SES_RECEPIENT_EMAIL ??
    req.params.recepientMail ??
    'recipient@example.com',
  subject: process.env.AWS_SES_SUBJECT ?? 'Hello from SES!',
  bodyText: 'This is a plain text email body.',
});

// Example 2: Sending an HTML email
await ses.sendEmail({
  // sender will be like service@reply-bots.com
  sender:
    req.params.senderSubDomain + '@' + process.env.AWS_SES_SENDER_MAIL_DOMAIN ??
    'sender@example.com',
  recipient:
    process.env.AWS_SES_RECEPIENT_EMAIL ??
    req.params.recepientMail ??
    'recipient@example.com',
  subject: process.env.AWS_SES_SUBJECT ?? 'Hello from SES!',
  bodyHtml: '<p>This is an HTML email body.</p>',
});
```

## Priorities for sender

1. if `AWS_SES_SENDER_MAIL_DOMAIN` exists, use this - req.params.senderSubDomain + '@' + process.env.AWS_SES_SENDER_MAIL_DOMAIN
2. if the above does not exist, and `AWS_SES_SENDER_EMAIL` exists, use that env directly,
3. if bothe of the above does not exists, try to create your own env variable or collect sender email from request body.
4. as a last option, hard code it.
