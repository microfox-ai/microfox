## Function: `listWebhooks`

Retrieves a paginated list of webhooks available to the user.

**Purpose:**
This function allows you to browse and manage your webhooks on the Apify platform. Webhooks are used to notify external services about events happening on the platform.

**Parameters:**
- `params` (object, optional): An object containing query parameters for pagination.
  - `offset` (number, optional): The number of webhooks to skip. Default: `0`.
  - `limit` (number, optional): The maximum number of webhooks to return. Default: `1000`.
  - `desc` (boolean, optional): If `true`, sorts webhooks in descending order. Default: `false`.

**Return Value:**
- `Promise<Pagination<Webhook>>`: A promise that resolves to a pagination object containing a list of webhooks.
- `Pagination<Webhook>` (object):
  - `total` (number): Total number of webhooks available.
  - `offset` (number): The starting offset of the returned webhooks.
  - `limit` (number): The maximum number of webhooks per page.
  - `count` (number): The number of webhooks returned in the current page.
  - `items` (array<Webhook>): An array of `Webhook` objects.
- `Webhook` (object):
  - `id` (string): Unique identifier of the webhook.
  - `name` (string): Name of the webhook.
  - `url` (string): URL where the webhook will send requests.
  - `eventTypes` (array<string>): Types of events that trigger the webhook.

**Examples:**

```typescript
// Example 1: List all webhooks
const allWebhooks = await apify.listWebhooks();
console.log(allWebhooks.items);

// Example 2: List the 5 most recently created webhooks
const recentWebhooks = await apify.listWebhooks({ limit: 5, desc: true });
console.log(recentWebhooks);
```