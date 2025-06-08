# sendBulkEmails Tool

**Tool**: `microfox_aws_ses_api-sendBulkEmails`

## Purpose
Use this tool to send the same email to multiple recipients in parallel via AWS SES.

## When to Use

Use `sendBulkEmails` when you need to:
- Send identical content to multiple recipients efficiently
- Distribute newsletters, announcements, or marketing campaigns
- Send system notifications to multiple users simultaneously  
- Manage event invitations or reminders for groups
- Broadcast emergency alerts or critical updates
- Handle organizational communications like policy updates
- Send survey invitations to user groups
- Distribute promotional campaigns to marketing lists

## Required Parameters

You must provide:
- **`sender`** (string): Verified email address of the sender
  - Example: `"newsletter@company.com"`
- **`recipients`** (array of strings): List of valid recipient email addresses
  - Example: `["user1@example.com", "user2@example.com", "user3@example.com"]`
- **`subject`** (string): Clear, descriptive subject line for all recipients
  - Example: `"Monthly Newsletter - December 2024"`

## Optional Parameters

You can also include:
- **`displayName`** (string): Friendly sender name for brand consistency
  - Example: `"Company Newsletter"`
- **`bodyText`** (string): Plain text version of the email content
  - Example: `"This month's highlights: New features, upcoming events, and company updates..."`
- **`bodyHtml`** (string): HTML version for rich formatting
  - Example: `"<h2>Monthly Highlights</h2><ul><li>New features</li><li>Upcoming events</li></ul>"`

## Usage Guidelines

**Email Content Requirements:**
- Ensure the same content is appropriate and relevant for all recipients
- Always provide either `bodyText` or `bodyHtml` (preferably both)
- Make subject lines descriptive and engaging for bulk audiences
- Keep content universally relevant to your entire recipient list

**Recipient Management:**
- Validate all recipient email addresses are properly formatted and active
- Monitor and remove invalid email addresses from your lists

**Sender Configuration:**
- Only use verified sender addresses from AWS SES
- Use appropriate addresses like newsletter@, updates@, or info@
- Include `displayName` to maintain brand consistency across campaigns
- Choose sender information that builds trust and recognition

**Performance & Compliance:**
- Tool automatically handles parallel sending for optimal efficiency
- Be aware of AWS SES rate limits for bulk operations
- Follow CAN-SPAM Act and other anti-spam regulations
- Ensure GDPR compliance for EU recipients
- Monitor delivery rates and engagement metrics
- Implement robust error handling for failed deliveries

**Content Standards:**
- Ensure content displays well on mobile devices
- Use proper contrast ratios and alt text for images  
- Make call-to-action buttons and links clearly identifiable
- Maintain consistent visual branding and messaging tone
- Provide value to justify bulk communication

**Technical Considerations:**
- Track MessageId responses for delivery confirmation
- Be aware of AWS SES sending quotas and daily limits

## Response Handling

**Successful sends return:**
An array with one response object per recipient, each containing:
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
- **Partial failures**: Some recipients may succeed while others fail - handle individual responses
- Always implement comprehensive error handling and logging for bulk operations

## Example Usage

**Newsletter Distribution:**
```
sender: "news@company.com"
recipients: ["subscriber1@example.com", "subscriber2@example.com", "subscriber3@example.com"]
subject: "Product Update: New Features Available"
displayName: "Product Team"
bodyText: "We're excited to announce new features: Feature A, Feature B, and Feature C..."
bodyHtml: "<h1>New Features Available!</h1><ul><li>Feature A</li><li>Feature B</li></ul>"
```

**System Maintenance Notification:**
```
sender: "system@company.com"
recipients: ["admin1@company.com", "admin2@company.com", "user1@company.com"]
subject: "Scheduled Maintenance - December 15th"
displayName: "System Administration"
bodyText: "Scheduled maintenance will occur on December 15th from 2:00 AM to 4:00 AM EST..."
bodyHtml: "<h2>Scheduled Maintenance Notice</h2><p>Maintenance window: <strong>Dec 15, 2:00-4:00 AM EST</strong></p>"
```

**Event Invitation:**
```
sender: "events@company.com"
recipients: ["team1@company.com", "team2@company.com", "team3@company.com"]
subject: "Invitation: Annual Company Meeting"
displayName: "Events Team"
bodyText: "You're invited to our Annual Company Meeting on January 20th at 10:00 AM..."
bodyHtml: "<h1>Annual Company Meeting</h1><p>Date: <strong>January 20th, 10:00 AM</strong></p>"
```
