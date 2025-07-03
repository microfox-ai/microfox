## Function: `getWebhook`

Retrieves the details of a specific webhook by its ID.

**Purpose:**
This function allows you to fetch the configuration of a single webhook, such as its name, target URL, and the events it's subscribed to.

**Parameters:**
- `webhookId` (string): The unique identifier of the webhook to retrieve.

**Return Value:**
- `Promise<Webhook>`: A promise that resolves to the `Webhook` object.
- `Webhook` (object):
  - `id` (string): Unique identifier of the webhook.
  - `name` (string): Name of the webhook.
  - `url` (string): URL where the webhook will send requests.
  - `eventTypes` (array<string>): Types of events that trigger the webhook.

**Examples:**

```typescript
// Example 1: Get a specific webhook by its ID
const webhookId = '<webhook_id>';
const webhook = await apify.getWebhook(webhookId);
console.log(webhook);
```