## Function: `createWebhook`

Creates a webhook for a specific form.

**Purpose:**
This function creates a webhook that will be triggered when a submission is created for the specified form.

**Parameters:**

* `formId`: A string representing the ID of the form.
* `url`: A string representing the URL of the webhook endpoint.

**Return Value:**

* `Promise<WebhookCreateResponse>` A promise that resolves to a `WebhookCreateResponse` object.
    * `WebhookCreateResponse`: An object containing the webhook data.

**Examples:**

```typescript
// Example: Create a webhook
async function createWebhookExample(formId: string, url: string) {
  const webhook = await filloutSDK.createWebhook(formId, url);
  console.log(webhook);
}
```