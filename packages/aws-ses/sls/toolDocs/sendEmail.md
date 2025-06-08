# sendEmail Tool

**Tool**: `microfox_aws_ses_api-sendEmail`

## Purpose
Use this tool to send a single email to one recipient via AWS SES.

## When to Use

Use `sendEmail` when you need to:
- Send personalized messages with unique content for each recipient
- Handle transactional emails (confirmations, receipts, password resets)
- Send account management notifications (registrations, updates, verifications) 
- Respond to customer support inquiries with automated replies
- Send one-off communications that don't require bulk processing
- Deliver appointment confirmations, reminders, or personal alerts

## Required Parameters

You must provide:
- **`sender`** (string): Verified email address of the sender
  - Example: `"noreply@company.com"`
- **`recipient`** (string): Valid email address of the recipient  
  - Example: `"user@example.com"`
- **`subject`** (string): Clear, descriptive subject line
  - Example: `"Welcome to Our Platform"`

## Optional Parameters

You can also include:
- **`displayName`** (string): Friendly sender name for better recognition
  - Example: `"Company Support Team"`
- **`bodyText`** (string): Plain text version of the email content
  - Example: `"Welcome! Thanks for joining our platform. Get started by..."`
- **`bodyHtml`** (string): HTML version for rich formatting
  - Example: `"<h1>Welcome!</h1><p>Thanks for joining our platform. <a href='...'>Get started</a></p>"`

## Usage Guidelines

**Email Content Requirements:**
- Always provide either `bodyText` or `bodyHtml` (preferably both)
- Keep subject lines under 50 characters when possible
- Avoid spam trigger words and excessive formatting

**Sender Best Practices:**
- Only use verified sender addresses from AWS SES
- Use recognizable business email addresses (support@, noreply@, info@)
- Include `displayName` for better user experience
- Maintain consistent branding across emails

**Content Standards:**
- Ensure content is mobile-friendly and accessible
- Use HTTPS for all links
- Follow GDPR and privacy regulations

**Technical Considerations:**
- Validate recipient email formats before sending
- Handle errors gracefully and track MessageId for delivery confirmation
- Be aware of AWS SES rate limits and sending quotas

## Response Handling

**Successful sends return:**
```json
{
  "SendEmailResult": {
    "MessageId": "0000014a-f896-4c07-b62e-c4d73f0f24c2-000000"
  },
  "ResponseMetadata": {
    "RequestId": "b25f48e8-84fd-11e6-a077-c98a0b5a1d68"
  }
}
```

**Handle these errors:**
- **400 Bad Request**: Fix invalid email addresses or missing required fields
- **500 Internal Server Error**: Retry after addressing AWS service issues or rate limits

## Example Usage

**Welcome Email:**
```
sender: "welcome@company.com"
recipient: "newuser@example.com"
subject: "Welcome to Company Platform"
displayName: "Company Team"
bodyText: "Welcome to our platform! Your account is now active..."
bodyHtml: "<h1>Welcome!</h1><p>Your account is now active...</p>"
```

**Password Reset:**
```
sender: "security@company.com"  
recipient: "user@example.com"
subject: "Password Reset Request"
displayName: "Security Team"
bodyText: "Click this link to reset your password: https://company.com/reset/token123"
bodyHtml: "<p>Click <a href='https://company.com/reset/token123'>here</a> to reset your password.</p>"
``` 