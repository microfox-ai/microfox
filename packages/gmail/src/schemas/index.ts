import { z } from 'zod';

/**
 * Schema for Gmail SDK configuration
 * @description Configuration required to initialize the Gmail SDK client
 */
export const GmailSdkConfigSchema = z
  .object({
    clientId: z
      .string()
      .min(1)
      .describe(
        'The client ID for Google OAuth authentication. Obtained from Google Cloud Console.',
      ),
    clientSecret: z
      .string()
      .min(1)
      .describe(
        'The client secret for Google OAuth authentication. Obtained from Google Cloud Console.',
      ),
    accessToken: z
      .string()
      .min(1)
      .describe(
        'The access token obtained after OAuth authentication. Used for API requests.',
      ),
    refreshToken: z
      .string()
      .min(1)
      .describe(
        'The refresh token used to obtain new access tokens when they expire.',
      ),
    scopes: z
      .array(z.string())
      .default([
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.labels',
      ])
      .optional()
      .describe('The OAuth scopes required for the Gmail API operations.'),
  })
  .passthrough();

/**
 * Schema for message headers
 * @description Represents the headers of a Gmail message
 */
export const MessageHeadersSchema = z.object({
  name: z
    .string()
    .describe('The name of the header (e.g., "From", "To", "Subject")'),
  value: z
    .string()
    .describe('The value of the header (e.g., email address, subject text)'),
});

/**
 * Schema for message payload
 * @description Represents the payload of a Gmail message
 */
export const MessagePayloadSchema = z.object({
  headers: z.array(MessageHeadersSchema).describe('The headers of the message'),
  parts: z
    .array(z.any())
    .optional()
    .describe('The parts of a multipart message'),
  body: z.any().optional().describe('The body of the message'),
  partsId: z
    .string()
    .optional()
    .describe('The ID of this part in a multipart message'),
  mimeType: z
    .string()
    .optional()
    .describe('The MIME type of the message content'),
  filename: z.string().optional(),
});

/**
 * Schema for Gmail message
 * @description Represents a complete Gmail message with all its metadata and content
 */
export const MessageSchema = z
  .object({
    id: z.string().describe('The unique identifier of the message.'),
    threadId: z
      .string()
      .describe('The ID of the thread this message belongs to.'),
    labelIds: z
      .array(z.string())
      .optional()
      .describe('The IDs of labels applied to this message.'),
    snippet: z
      .string()
      .optional()
      .describe('A short preview of the message content.'),
    historyId: z
      .string()
      .optional()
      .describe('The history ID for tracking changes to the message.'),
    internalDate: z
      .string()
      .optional()
      .describe('The internal timestamp of the message.'),
    payload: MessagePayloadSchema.optional().describe(
      'The message content and structure.',
    ),
    sizeEstimate: z
      .number()
      .optional()
      .describe('The estimated size of the message in bytes.'),
    raw: z.string().optional().describe('The raw RFC 2822 formatted message.'),
  })
  .passthrough();

/**
 * Schema for Gmail thread
 * @description Represents a conversation thread in Gmail
 */
export const ThreadSchema = z
  .object({
    id: z.string().describe('The unique identifier of the thread.'),
    messages: z
      .array(MessageSchema)
      .optional()
      .describe('The messages that make up this thread.'),
    snippet: z
      .string()
      .optional()
      .describe('A short preview of the thread content.'),
    historyId: z
      .string()
      .optional()
      .describe('The history ID for tracking changes to the thread.'),
  })
  .passthrough();

/**
 * Schema for Gmail label
 * @description Represents a label in Gmail that can be applied to messages
 */
export const LabelSchema = z
  .object({
    id: z.string().describe('The unique identifier of the label.'),
    name: z.string().describe('The display name of the label.'),
    type: z
      .enum(['system', 'user'])
      .optional()
      .describe('The type of label (system-defined or user-created).'),
    messageListVisibility: z
      .enum(['show', 'hide'])
      .optional()
      .describe('Whether the label is visible in the message list.'),
    labelListVisibility: z
      .enum(['labelShow', 'labelHide', 'labelShowIfUnread'])
      .optional()
      .describe('Whether the label is visible in the label list.'),
    color: z
      .object({
        textColor: z
          .string()
          .optional()
          .describe('The text color of the label.'),
        backgroundColor: z
          .string()
          .optional()
          .describe('The background color of the label.'),
      })
      .optional()
      .describe('The color settings for the label.'),
  })
  .passthrough();

/**
 * Schema for message input
 * @description Input required to send a new email message
 */
export const MessageInputSchema = z
  .object({
    to: z.string().email().describe('The primary recipient email address.'),
    from: z.string().email().describe('The sender email address.'),
    subject: z.string().describe('The subject line of the email.'),
    body: z.string().describe('The main content of the email.'),
    cc: z
      .array(z.string().email())
      .optional()
      .describe('Carbon copy recipients.'),
    bcc: z
      .array(z.string().email())
      .optional()
      .describe('Blind carbon copy recipients.'),
    contentType: z
      .enum(['text/plain', 'text/html', 'multipart/alternative'])
      .optional()
      .describe('The MIME type of the email content.'),
    plainTextBody: z
      .string()
      .optional()
      .describe(
        'Plain text version of the email body (for multipart messages).',
      ),
  })
  .passthrough();

/**
 * Schema for label input
 * @description Input required to create or update a Gmail label
 */
export const LabelInputSchema = z
  .object({
    name: z.string().describe('The name of the label.'),
    type: z
      .enum(['system', 'user'])
      .describe('The type of label (system-defined or user-created).'),
    messageListVisibility: z
      .enum(['show', 'hide'])
      .optional()
      .describe('Whether the label is visible in the message list.'),
    labelListVisibility: z
      .enum(['labelShow', 'labelHide', 'labelShowIfUnread'])
      .optional()
      .describe('Whether the label is visible in the label list.'),
    color: z
      .object({
        textColor: z
          .string()
          .optional()
          .describe('The text color of the label.'),
        backgroundColor: z
          .string()
          .optional()
          .describe('The background color of the label.'),
      })
      .optional()
      .describe('The color settings for the label.'),
  })
  .passthrough();
