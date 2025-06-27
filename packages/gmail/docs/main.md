# Gmail SDK

TypeScript SDK for interacting with the Gmail API.

## Installation

```bash
npm install @microfox/gmail
```

## Authentication

This SDK uses OAuth 2.0 for authentication. You need to provide the following credentials:

- `accessToken`: Your OAuth access token
- `refreshToken`: Your OAuth refresh token
- `clientId`: Your OAuth client ID
- `clientSecret`: Your OAuth client secret
- `redirectUrl`: Your OAuth redirect url

You can obtain these credentials by following the OAuth 2.0 flow for Gmail.

## Environment Variables

The following environment variables are used by this SDK:

- `GMAIL_ACCESS_TOKEN`: Your OAuth access token (Required)
- `GMAIL_REFRESH_TOKEN`: Your OAuth refresh token (Required)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID (Required)
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret (Required)
- `GOOGLE_REDIRECT_URI`: The redirect URI for your application (Required)

## Additional Information

To use this SDK, you need to set up a Google Cloud project and enable the Gmail API. Follow these steps:

1. Go to the Google Cloud Console (https://console.cloud.google.com/)

2. Create a new project or select an existing one

3. Enable the Gmail API for your project

4. Create OAuth 2.0 credentials (client ID and client secret)

5. Set up the OAuth consent screen, including the necessary scopes

Environment variables:

- GMAIL_ACCESS_TOKEN: The access token after the oauth authentication
- GMAIL_REFRESH_TOKEN: The refresh token after the oauth authentication
- GOOGLE_CLIENT_ID: Your Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Your Google OAuth client secret
- GOOGLE_REDIRECT_URI: The redirect URI for your application

To use the SDK, you can create an instance like this:

```typescript
import { createGmailSDK } from 'gmail';

const gmailSdk = createGmailSDK({
  accessToken: process.env.GMAIL_ACCESS_TOKEN!,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scopes: process.env.SCOPES,
});
```

Make sure to handle the OAuth flow to obtain and refresh access tokens. The SDK will automatically refresh the token when needed.

Rate limits: Be aware that the Gmail API has usage quotas and limits. For most users, this is 1,000,000,000 queries per day. You can check your specific quota in the Google Cloud Console.

For more detailed information on using the Gmail API, refer to the official documentation: https://developers.google.com/gmail/api/guides

## Constructor

## [createGmailSDK](./docs/createGmailSDK.md)

The GmailSDK constructor initializes a new instance of the SDK for interacting with the Gmail API.

It takes a GmailSDKConfig object as a parameter, which configures the OAuth 2.0 settings and the user ID.

**Parameters:**

- `config`: GmailSDKConfig object with the following properties:
  - `accessToken`: The access token after the oauth authentication
  - `refreshToken`: The refresh token after the oauth authentication
  - `clientId`: The client ID for the Google OAuth application.
  - `clientSecret`: The client secret for the Google OAuth application.
  - `scopes`: SCOPES needed to access
  - `userId` (optional): The user ID to use for API requests. Defaults to 'me'.

**Usage Example:**

```typescript
import { createGmailSDK } from 'gmail';

const gmailSdk = createGmailSDK({
  accessToken: process.env.GMAIL_ACCESS_TOKEN!,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scopes: process.env.SCOPES,
});
```

**Authentication:**

This SDK uses OAuth 2.0 for authentication. You need to set up a Google Cloud project, enable the Gmail API, and create OAuth 2.0 credentials. See the extra information for detailed instructions.

**Error Handling:**

The constructor will throw an error if the provided configuration is invalid. The SDK functions will throw errors if there are issues with the API requests or authentication.

## Functions

## [listLabels](./docs/listLabels.md)

Lists all labels for the authenticated user.

**Return Type:**

- `Promise<ListLabelsResponse>`: A promise that resolves to a ListLabelsResponse object containing an array of labels.

**Usage Example:**

```typescript
const labels = await gmailSdk.listLabels();
console.log(labels);
```

**Code Example:**

```typescript
async function getLabels() {
  const labels = await gmailSdk.listLabels();
  console.log(labels);
}

getLabels();
```

## [createLabel](./docs/createLabel.md)

Creates a new label.

**Parameters:**

- `label`: Omit<Label, 'id'> object with the following properties:
  - `name`: The display name of the label.
  - `messageListVisibility` (optional): The visibility of the label in the message list.
  - `labelListVisibility` (optional): The visibility of the label in the label list.
  - `type`: The type of the label.

**Return Type:**

- `Promise<Label>`: A promise that resolves to the created Label object.

**Usage Example:**

```typescript
const newLabel = await gmailSdk.createLabel({ name: 'My Label', type: 'user' });
console.log(newLabel);
```

**Code Example:**

```typescript
async function createNewLabel() {
  const newLabel = await gmailSdk.createLabel({
    name: 'My Label',
    type: 'user',
  });
  console.log(newLabel);
}

createNewLabel();
```

## [getLabel](./docs/getLabel.md)

Gets a label by ID.

**Parameters:**

- `id`: The ID of the label to retrieve.

**Return Type:**

- `Promise<Label>`: A promise that resolves to the Label object.

**Usage Example:**

```typescript
const label = await gmailSdk.getLabel('LABEL_ID');
console.log(label);
```

**Code Example:**

```typescript
async function getLabelById() {
  const label = await gmailSdk.getLabel('LABEL_ID');
  console.log(label);
}

getLabelById();
```

## [updateLabel](./docs/updateLabel.md)

Updates an existing label.

**Parameters:**

- `id`: The ID of the label to update.
- `label`: Partial<Label> object with the properties to update.

**Return Type:**

- `Promise<Label>`: A promise that resolves to the updated Label object.

**Usage Example:**

```typescript
const updatedLabel = await gmailSdk.updateLabel('LABEL_ID', {
  name: 'New Label Name',
});
console.log(updatedLabel);
```

**Code Example:**

```typescript
async function updateLabelById() {
  const updatedLabel = await gmailSdk.updateLabel('LABEL_ID', {
    name: 'New Label Name',
  });
  console.log(updatedLabel);
}

updateLabelById();
```

## [deleteLabel](./docs/deleteLabel.md)

Deletes a label.

**Parameters:**

- `id`: The ID of the label to delete.

**Return Type:**

- `Promise<void>`: A promise that resolves when the label is deleted.

**Usage Example:**

```typescript
await gmailSdk.deleteLabel('LABEL_ID');
```

**Code Example:**

```typescript
async function deleteLabelById() {
  await gmailSdk.deleteLabel('LABEL_ID');
}

deleteLabelById();
```

## [listMessages](./docs/listMessages.md)

Lists messages matching the specified query parameters.

**Parameters:**

- `params` (optional): An object with the following properties:
  - `q`: A search query string.
  - `pageToken`: A page token to retrieve the next page of results.
  - `maxResults`: The maximum number of results to return.

**Return Type:**

- `Promise<ListMessagesResponse>`: A promise that resolves to a ListMessagesResponse object containing an array of messages.

**Usage Example:**

```typescript
const messages = await gmailSdk.listMessages({ q: 'from:me' });
console.log(messages);
```

**Code Example:**

```typescript
async function listMessagesByQuery() {
  const messages = await gmailSdk.listMessages({ q: 'from:me' });
  console.log(messages);
}

listMessagesByQuery();
```

## [getMessage](./docs/getMessage.md)

Gets a message by ID.

**Parameters:**

- `id`: The ID of the message to retrieve.

**Return Type:**

- `Promise<Message>`: A promise that resolves to the Message object.

**Usage Example:**

```typescript
const message = await gmailSdk.getMessage('MESSAGE_ID');
console.log(message);
```

**Code Example:**

```typescript
async function getMessageById() {
  const message = await gmailSdk.getMessage('MESSAGE_ID');
  console.log(message);
}

getMessageById();
```

## [sendMessage](./docs/sendMessage.md)

Sends a message.

**Parameters:**

- `message`: The Message object to send.

**Return Type:**

- `Promise<Message>`: A promise that resolves to the sent Message object.

**Usage Example:**

```typescript
const sentMessage = await gmailSdk.sendMessage(message);
console.log(sentMessage);
```

**Code Example:**

```typescript
async function sendMessageObject() {
  const sentMessage = await gmailSdk.sendMessage(message);
  console.log(sentMessage);
}

sendMessageObject();
```

## [listThreads](./docs/listThreads.md)

Lists threads matching the specified query parameters.

**Parameters:**

- `params` (optional): An object with the following properties:
  - `q`: A search query string.
  - `pageToken`: A page token to retrieve the next page of results.
  - `maxResults`: The maximum number of results to return.

**Return Type:**

- `Promise<ListThreadsResponse>`: A promise that resolves to a ListThreadsResponse object containing an array of threads.

**Usage Example:**

```typescript
const threads = await gmailSdk.listThreads({ q: 'from:me' });
console.log(threads);
```

**Code Example:**

```typescript
async function listThreadsByQuery() {
  const threads = await gmailSdk.listThreads({ q: 'from:me' });
  console.log(threads);
}

listThreadsByQuery();
```

## [getThread](./docs/getThread.md)

Gets a thread by ID.

**Parameters:**

- `id`: The ID of the thread to retrieve.

**Return Type:**

- `Promise<Thread>`: A promise that resolves to the Thread object.

**Usage Example:**

```typescript
const thread = await gmailSdk.getThread('THREAD_ID');
console.log(thread);
```

**Code Example:**

```typescript
async function getThreadById() {
  const thread = await gmailSdk.getThread('THREAD_ID');
  console.log(thread);
}

getThreadById();
```
