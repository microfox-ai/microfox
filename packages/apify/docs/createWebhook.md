## Function: `createWebhook`

Creates a new webhook with the specified configuration.

**Purpose:**
This function is used to programmatically create a new webhook to receive notifications about events on the Apify platform, such as an actor run finishing.

**Parameters:**
- `webhook` (object): An object representing the webhook to be created. The `id` property is omitted.
  - `name` (string): A name for the new webhook.
  - `url` (string): The URL to which the webhook will send POST requests.
  - `eventTypes` (array<string>): An array of event types that will trigger the webhook (e.g., `ACTOR.RUN.SUCCEEDED`).
  - ... other fields from the `Webhook` type that can be set on creation.

**Return Value:**
- `Promise<Webhook>`: A promise that resolves to the newly created `Webhook` object.
- `Webhook` (object):
  - `id` (string): Unique identifier of the webhook.
  - `name` (string): Name of the webhook.
  - `url` (string): URL where the webhook will send requests.
  - `eventTypes` (array<string>): Types of events that trigger the webhook.

**Examples:**

```typescript
// Example 1: Create a webhook for successful actor runs
const newWebhookData = {
  name: 'my-success-notifier',
  url: 'https://my-service.com/webhook-handler',
  eventTypes: ['ACTOR.RUN.SUCCEEDED']
};
const newWebhook = await apify.createWebhook(newWebhookData);
console.log(newWebhook);
```