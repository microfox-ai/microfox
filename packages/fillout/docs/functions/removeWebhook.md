## Function: `removeWebhook`

Removes a webhook.

**Purpose:**
This function removes a webhook by its ID.

**Parameters:**

* `webhookId`: A number representing the ID of the webhook to remove.

**Return Value:**

* `Promise<void>` A promise that resolves when the webhook is removed.

**Examples:**

```typescript
// Example: Remove a webhook
async function removeWebhookExample(webhookId: number) {
  await filloutSDK.removeWebhook(webhookId);
  console.log("Webhook removed successfully");
}
```