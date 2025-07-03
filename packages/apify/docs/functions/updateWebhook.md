## Function: `updateWebhook`

Updates an existing webhook with new data. Only the fields provided in the `webhook` object will be modified.

**Purpose:**
This function is used to modify the properties of an existing webhook, such as changing its name, target URL, or subscribed event types.

**Parameters:**
- `webhookId` (string): The unique identifier of the webhook to update.
- `webhook` (object): An object containing the fields to update. This is a partial representation of the `Webhook` type.
  - `name` (string, optional): The new name for the webhook.
  - `url` (string, optional): The new target URL for the webhook.
  - `eventTypes` (array<string>, optional): The new list of event types.

**Return Value:**
- `Promise<Webhook>`: A promise that resolves to the updated `Webhook` object.
- `Webhook` (object):
  - `id` (string): Unique identifier of the webhook.
  - `name` (string): Name of the webhook.
  - `url` (string): URL where the webhook will send requests.
  - `eventTypes` (array<string>): Types of events that trigger the webhook.

**Examples:**

```typescript
// Example 1: Update the name and URL of a webhook
const webhookId = '<webhook_id>';
const updatedWebhookData = {
  name: 'my-updated-webhook',
  url: 'https://my-new-service.com/handler'
};
const updatedWebhook = await apify.updateWebhook(webhookId, updatedWebhookData);
console.log(updatedWebhook);
```