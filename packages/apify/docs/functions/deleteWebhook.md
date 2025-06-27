## Function: `deleteWebhook`

Deletes a specific webhook by its unique identifier.

**Purpose:**
This function permanently removes a webhook from the Apify platform. This action is irreversible.

**Parameters:**
- `webhookId` (string): The unique identifier of the webhook to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the webhook has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete a webhook by its ID
const webhookId = '<webhook_id_to_delete>';
await apify.deleteWebhook(webhookId);
console.log('Webhook deleted successfully.');
```