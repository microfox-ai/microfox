## Constructor: `createNotionSDK`

Creates a new instance of the NotionSDK. This is the main entry point for interacting with the Notion API.

**Purpose:**
Initializes the NotionSDK with the provided API key.

**Parameters:**

- `options`: object (required)
  - `apiKey`: string (required). The API key for authenticating with the Notion API.

**Return Value:**

- `NotionSDK`: An instance of the NotionSDK class.

**Examples:**

```typescript
// Example: Creating a NotionSDK instance
const notion = createNotionSDK({
  apiKey: process.env.NOTION_API_KEY
});
```