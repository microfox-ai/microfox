# Microfox AWS SES

A lightweight, type-safe SDK for interacting with AWS Simple Email Service (SES)

## Installation

```bash
npm install @microfox/aws-ses
```

## Environment Variables

The following environment variables are used by this SDK:

- `AWS_SES_ACCESS_KEY_ID`: The AWS access key ID. Used to authenticate with AWS SES. (Required)
- `AWS_SES_SECRET_ACCESS_KEY`: The AWS secret access key. Used to authenticate with AWS SES. (Required)
- `AWS_SES_REGION`: The region in which the AWS SES server is "us-east-1"

Optional environment variables

- `AWS_SES_SENDER_MAIL_DOMAIN`: The domain of the sender email.

## Additional Information

Use the `createSESClient` constructor to create a new AWS SES client.

All email addresses must be verified in AWS SES before sending.

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [createSESSdk](./docs/createSESSdk.md)
- [sendEmail](./docs/sendEmail.md)
- [sendBulkEmails](./docs/sendBulkEmails.md)
