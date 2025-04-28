# @microfox/gmail-sdk

A TypeScript SDK for interacting with Gmail API.

## Project Overview

@microfox/gmail-sdk is a powerful and easy-to-use TypeScript SDK for interacting with Gmail. It provides a simple interface to perform operations such as sending emails, managing messages, threads, and labels.

## Installation

Install the package using npm:

```bash
npm install @microfox/gmail-sdk
```

Or using yarn:

```bash
yarn add @microfox/gmail-sdk
```

## Usage

First, import the SDK and create an instance:

```typescript
import { createGmailSdk, GmailSdkConfig } from '@microfox/gmail-sdk';

const config: GmailSdkConfig = {
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  refreshToken: 'YOUR_REFRESH_TOKEN',
};

const gmailSdk = createGmailSdk(config);
```

## API Reference

### Message Management

#### `listMessages(query?: string, maxResults: number = 100): Promise<Message[]>`

Lists messages in the user's mailbox with optional filtering.

```typescript
// List all messages
const messages = await gmailSdk.listMessages();

// List messages with a specific query
const unreadMessages = await gmailSdk.listMessages('is:unread');
const fromSpecificSender = await gmailSdk.listMessages(
  'from:example@domain.com',
);
const withLabel = await gmailSdk.listMessages('label:Important');
```

#### `getMessage(messageId: string): Promise<Message>`

Gets a specific message by its ID.

```typescript
const message = await gmailSdk.getMessage('messageId123');
console.log(message.snippet); // Get the message preview
```

#### `modifyMessageLabels(messageId: string, addLabelIds?: string[], removeLabelIds?: string[]): Promise<Message>`

Modifies the labels of a message.

```typescript
// Add and remove labels from a message
const updatedMessage = await gmailSdk.modifyMessageLabels(
  'messageId123',
  ['IMPORTANT', 'STARRED'], // Labels to add
  ['UNREAD'], // Labels to remove
);
```

#### `trashMessage(messageId: string): Promise<Message>`

Moves a message to the trash.

```typescript
const trashedMessage = await gmailSdk.trashMessage('messageId123');
```

#### `untrashMessage(messageId: string): Promise<Message>`

Restores a message from the trash.

```typescript
const restoredMessage = await gmailSdk.untrashMessage('messageId123');
```

### Thread Management

#### `listThreads(query?: string, maxResults: number = 100): Promise<Thread[]>`

Lists threads in the user's mailbox with optional filtering.

```typescript
// List all threads
const threads = await gmailSdk.listThreads();

// List threads with a specific query
const unreadThreads = await gmailSdk.listThreads('is:unread');
const starredThreads = await gmailSdk.listThreads('is:starred');
```

#### `getThread(threadId: string): Promise<Thread>`

Gets a specific thread by its ID.

```typescript
const thread = await gmailSdk.getThread('threadId123');
console.log(thread.messages); // Access all messages in the thread
```

### Label Management

#### `listLabels(): Promise<Label[]>`

Lists all labels in the user's mailbox.

```typescript
const labels = await gmailSdk.listLabels();
labels.forEach(label => console.log(label.name));
```

#### `createLabel(label: Omit<Label, 'id'>): Promise<Label>`

Creates a new label.

```typescript
const newLabel = await gmailSdk.createLabel({
  name: 'Project X',
  messageListVisibility: 'show',
  labelListVisibility: 'labelShow',
  color: {
    textColor: '#000000',
    backgroundColor: '#ff0000',
  },
});
```

#### `updateLabel(labelId: string, label: Partial<Label>): Promise<Label>`

Updates an existing label.

```typescript
const updatedLabel = await gmailSdk.updateLabel('labelId123', {
  name: 'Updated Label Name',
  color: {
    textColor: '#ffffff',
    backgroundColor: '#000000',
  },
});
```

#### `deleteLabel(labelId: string): Promise<void>`

Deletes a label.

```typescript
await gmailSdk.deleteLabel('labelId123');
```

### Email Operations

#### `sendEmail(input: MessageInput): Promise<Message>`

Sends an email.

```typescript
const sentMessage = await gmailSdk.sendEmail({
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Test Email',
  body: 'This is a test email sent using the Gmail SDK.',
  cc: ['cc1@example.com', 'cc2@example.com'],
  bcc: ['bcc@example.com'],
});
```

## Configuration

The SDK requires the following configuration:

```typescript
interface GmailSdkConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}
```

Ensure you have obtained these credentials from the Google Cloud Console and have the necessary permissions to access Gmail API.

## Search Query Examples

The SDK supports Gmail's search query syntax. Here are some common examples:

```typescript
// Unread messages
'is:unread';

// Messages from a specific sender
'from:example@domain.com';

// Messages with a specific subject
'subject:meeting';

// Messages with a specific label
'label:Important';

// Messages within a date range
'after:2023/01/01 before:2023/12/31';

// Messages with attachments
'has:attachment';

// Messages larger than a specific size
'larger:5M';

// Combine multiple criteria
'from:example@domain.com is:unread label:Important';
```

## Dependencies

- @microfox/google-oauth: For handling OAuth authentication with Google
- zod: For runtime type checking and validation

## Error Handling

The SDK throws errors in the following cases:

- Invalid configuration
- Authentication failures
- API request failures
- Invalid input data

Example error handling:

```typescript
try {
  const messages = await gmailSdk.listMessages();
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to list messages:', error.message);
  }
}
```
