import { z } from 'zod';

// Block Kit schemas
const BlockTextSchema = z
  .object({
    type: z
      .enum(['plain_text', 'mrkdwn'])
      .describe(
        'The formatting type to use for this text object. Use plain_text for raw text, or mrkdwn for markdown-formatted text.',
      ),
    text: z.string().describe('The actual text content to display.'),
    emoji: z
      .boolean()
      .optional()
      .describe(
        'When type is plain_text, indicates whether emojis in this text should be escaped into the colon emoji format.',
      ),
    verbatim: z
      .boolean()
      .optional()
      .describe(
        'When type is mrkdwn, indicates whether to escape special characters like & < and >.',
      ),
  })
  .strict();

const BlockImageSchema = z
  .object({
    type: z
      .literal('image')
      .describe('The type of block. Must be "image" for image blocks.'),
    image_url: z.string().url().describe('The URL of the image to display.'),
    alt_text: z
      .string()
      .describe(
        'A plain-text summary of the image for accessibility purposes.',
      ),
    title: BlockTextSchema.optional().describe(
      'An optional title that appears above the image.',
    ),
    block_id: z
      .string()
      .optional()
      .describe('A unique identifier for this block.'),
  })
  .strict();

const BlockButtonSchema = z
  .object({
    type: z
      .literal('button')
      .describe(
        'The type of block element. Must be "button" for button elements.',
      ),
    text: BlockTextSchema.describe('The text that appears on the button.'),
    action_id: z
      .string()
      .describe(
        'A unique identifier for the action triggered when this button is clicked.',
      ),
    url: z
      .string()
      .url()
      .optional()
      .describe('A URL to redirect to when this button is clicked.'),
    value: z
      .string()
      .optional()
      .describe(
        'A custom value to include with the action payload when this button is clicked.',
      ),
    style: z
      .enum(['primary', 'danger'])
      .optional()
      .describe(
        'The visual style of the button. Primary is green, danger is red.',
      ),
    confirm: z
      .any()
      .optional()
      .describe(
        'A confirmation dialog that appears before the action is executed.',
      ),
  })
  .strict();

const BlockSectionSchema = z
  .object({
    type: z
      .literal('section')
      .describe('The type of block. Must be "section" for section blocks.'),
    text: BlockTextSchema.optional().describe(
      'The primary text content of the section.',
    ),
    block_id: z
      .string()
      .optional()
      .describe('A unique identifier for this block.'),
    fields: z
      .array(BlockTextSchema)
      .optional()
      .describe('An array of text objects to display in a columnar format.'),
    accessory: z
      .union([BlockButtonSchema, BlockImageSchema])
      .optional()
      .describe(
        'An optional interactive or visual element to accompany the section.',
      ),
  })
  .strict();

const BlockDividerSchema = z
  .object({
    type: z
      .literal('divider')
      .describe('The type of block. Must be "divider" for divider blocks.'),
    block_id: z
      .string()
      .optional()
      .describe('A unique identifier for this block.'),
  })
  .strict();

const BlockSchema = z
  .union([BlockSectionSchema, BlockImageSchema, BlockDividerSchema])
  .describe(
    'A Block Kit block that can be used to compose rich message layouts.',
  );

// Legacy attachment schemas
const AttachmentFieldSchema = z
  .object({
    title: z.string().describe('The title of the field.'),
    value: z.string().describe('The value of the field.'),
    short: z
      .boolean()
      .optional()
      .describe(
        'Indicates whether this field should be displayed as a short field (side-by-side with another field).',
      ),
  })
  .strict();

const AttachmentSchema = z
  .object({
    fallback: z
      .string()
      .optional()
      .describe(
        'A plain text summary of the attachment used in notifications.',
      ),
    color: z
      .string()
      .optional()
      .describe(
        'The color to use for the attachment. Can be hex (#FF0000) or predefined colors like "good", "warning", "danger".',
      ),
    pretext: z
      .string()
      .optional()
      .describe('Text that appears above the attachment block.'),
    author_name: z.string().optional().describe('The name of the author.'),
    author_link: z
      .string()
      .url()
      .optional()
      .describe('A URL that will hyperlink the author_name text.'),
    author_icon: z
      .string()
      .url()
      .optional()
      .describe(
        'A URL that displays a small image to the left of the author_name text.',
      ),
    title: z.string().optional().describe('The title of the attachment.'),
    title_link: z
      .string()
      .url()
      .optional()
      .describe('A URL that will hyperlink the title text.'),
    text: z
      .string()
      .optional()
      .describe('The main text content of the attachment.'),
    fields: z
      .array(AttachmentFieldSchema)
      .optional()
      .describe(
        'An array of field objects that get displayed in a table-like format.',
      ),
    image_url: z
      .string()
      .url()
      .optional()
      .describe(
        'A URL to an image file that will be displayed inside the attachment.',
      ),
    thumb_url: z
      .string()
      .url()
      .optional()
      .describe(
        'A URL to an image file that will be displayed as a thumbnail on the right side.',
      ),
    footer: z
      .string()
      .optional()
      .describe('Text that appears in the footer section.'),
    footer_icon: z
      .string()
      .url()
      .optional()
      .describe(
        'A URL to an image file that will be displayed to the left of the footer text.',
      ),
    ts: z
      .number()
      .optional()
      .describe('Unix timestamp that will be used to format the footer.'),
  })
  .strict();

// Message schemas
const SlackMessageSchema = z
  .object({
    channel: z
      .string()
      .describe(
        'The channel ID or name where the message should be posted (e.g., "#general" or "C1234567890").',
      ),
    text: z
      .string()
      .describe(
        'The text content of the message. When using blocks, this becomes the fallback text for notifications.',
      ),
    blocks: z
      .array(BlockSchema)
      .optional()
      .describe(
        'An array of Block Kit blocks that define the rich layout of the message.',
      ),
    attachments: z
      .array(AttachmentSchema)
      .optional()
      .describe('Legacy message attachments for backward compatibility.'),
    thread_ts: z
      .string()
      .optional()
      .describe(
        'The timestamp of a parent message to reply to, creating a thread.',
      ),
    reply_broadcast: z
      .boolean()
      .optional()
      .describe(
        'When replying to a thread, this broadcasts the message to the channel as well.',
      ),
    mrkdwn: z
      .boolean()
      .optional()
      .describe(
        'Determines whether markdown formatting is enabled for this message.',
      ),
    parse: z
      .enum(['none', 'full'])
      .optional()
      .describe(
        'Change how messages are treated: "none" disables linkification, "full" enables it.',
      ),
    link_names: z
      .boolean()
      .optional()
      .describe('Find and link channel names and usernames in message text.'),
    unfurl_links: z
      .boolean()
      .optional()
      .describe('Enable or disable URL unfurling for regular URLs.'),
    unfurl_media: z
      .boolean()
      .optional()
      .describe('Enable or disable URL unfurling for media URLs.'),
    username: z
      .string()
      .optional()
      .describe('Custom username that overrides the default bot name.'),
    icon_emoji: z
      .string()
      .optional()
      .describe(
        'Custom emoji to use as the bot icon (e.g., ":chart_with_upwards_trend:").',
      ),
    icon_url: z
      .string()
      .url()
      .optional()
      .describe('Custom image URL to use as the bot icon.'),
    metadata: z
      .record(z.string(), z.unknown())
      .optional()
      .describe('Additional metadata associated with the message.'),
  })
  .passthrough(); // Allow additional fields that Slack might send

const MessageResponseSchema = z
  .object({
    type: z
      .string()
      .optional()
      .describe('The type of message (usually "message").'),
    text: z.string().optional().describe('The text content of the message.'),
    user: z
      .string()
      .optional()
      .describe('The ID of the user that posted the message.'),
    team: z
      .string()
      .optional()
      .describe('The ID of the team the message was posted in.'),
    thread_ts: z
      .string()
      .optional()
      .describe('The timestamp of the parent message in a thread.'),
    parent_user_id: z
      .string()
      .optional()
      .describe('The ID of the user who sent the parent message.'),
    username: z
      .string()
      .optional()
      .describe('The username that posted the message.'),
    bot_id: z
      .string()
      .optional()
      .describe('The ID of the bot that posted the message.'),
    subtype: z
      .string()
      .optional()
      .describe('The subtype of the message, if any.'),
    ts: z
      .string()
      .optional()
      .describe('The timestamp of when the message was posted.'),
    blocks: z
      .array(BlockSchema)
      .optional()
      .describe('The Block Kit blocks in the message.'),
    attachments: z
      .array(AttachmentSchema)
      .optional()
      .describe('Legacy message attachments.'),
    bot_profile: z
      .object({
        id: z.string(),
        app_id: z.string(),
        name: z.string(),
        icons: z.record(z.string(), z.string()).optional(),
        deleted: z.boolean().optional(),
        updated: z.number().optional(),
        team_id: z.string().optional(),
      })
      .passthrough()
      .optional()
      .describe('Information about the bot that posted the message.'),
    app_id: z
      .string()
      .optional()
      .describe('The ID of the app that posted the message.'),
    edited: z
      .object({
        user: z.string().optional(),
        ts: z.string().optional(),
      })
      .passthrough()
      .optional()
      .describe('Information about message edits.'),
  })
  .passthrough() // Allow additional fields from Slack API
  .describe('A message in Slack.');

const SlackMessageResponseSchema = z
  .object({
    ok: z.boolean().describe('Indicates whether the API call was successful.'),
    channel: z
      .string()
      .optional()
      .describe('The channel ID where the message was posted.'),
    ts: z
      .string()
      .optional()
      .describe(
        'The timestamp of the posted message, used as a unique identifier.',
      ),
    message: z
      .union([MessageResponseSchema, z.record(z.string(), z.unknown())])
      .optional()
      .describe('Details about the posted message.'),
    error: z
      .string()
      .optional()
      .describe('Error message if the request failed.'),
    warning: z.string().optional().describe('Warning message from Slack API.'),
    response_metadata: z
      .object({
        warnings: z.array(z.string()).optional(),
        messages: z.array(z.string()).optional(),
      })
      .passthrough()
      .optional()
      .describe('Additional metadata about the response.'),
  })
  .passthrough() // Allow additional fields from Slack API
  .describe('Response from Slack message-related APIs.');

// File upload schema
const FileUploadSchema = z
  .object({
    channels: z
      .string()
      .optional()
      .describe(
        'Comma-separated list of channel IDs where the file should be shared.',
      ),
    content: z
      .string()
      .optional()
      .describe('File contents when uploading a file from text content.'),
    filename: z
      .string()
      .optional()
      .describe('Filename of the file being uploaded.'),
    filetype: z
      .string()
      .optional()
      .describe('A file type identifier (e.g., "pdf", "txt").'),
    initial_comment: z
      .string()
      .optional()
      .describe('Initial comment text to add to the file.'),
    thread_ts: z
      .string()
      .optional()
      .describe('Timestamp of the message to thread the file upload to.'),
    title: z.string().optional().describe('Title of the file being uploaded.'),
  })
  .passthrough();

const FileUploadResponseSchema = z
  .object({
    ok: z
      .boolean()
      .describe('Indicates whether the file upload was successful.'),
    file: z
      .object({
        id: z.string().describe('The unique identifier of the uploaded file.'),
        created: z
          .number()
          .optional()
          .describe('Timestamp when the file was created.'),
        timestamp: z
          .number()
          .optional()
          .describe('Timestamp when the file was uploaded.'),
        name: z.string().describe('The name of the uploaded file.'),
        title: z.string().describe('The title of the uploaded file.'),
        mimetype: z.string().describe('The MIME type of the file.'),
        filetype: z.string().describe('The Slack filetype identifier.'),
        pretty_type: z
          .string()
          .optional()
          .describe('Human-readable file type.'),
        user: z
          .string()
          .optional()
          .describe('ID of the user who uploaded the file.'),
        user_team: z
          .string()
          .optional()
          .describe('ID of the workspace the user belongs to.'),
        size: z.number().optional().describe('File size in bytes.'),
        mode: z.string().optional().describe('File mode/permissions.'),
        editable: z
          .boolean()
          .optional()
          .describe('Whether the file is editable.'),
        is_external: z
          .boolean()
          .optional()
          .describe('Whether the file is hosted externally.'),
        external_type: z
          .string()
          .optional()
          .describe('The type of external file.'),
        url_private: z
          .string()
          .optional()
          .describe('URL to access the file (requires authentication).'),
        url_private_download: z
          .string()
          .optional()
          .describe('URL to download the file (requires authentication).'),
        permalink: z
          .string()
          .optional()
          .describe('Permanent link to the file.'),
        permalink_public: z
          .string()
          .optional()
          .describe('Publicly accessible URL for the file.'),
        channels: z
          .array(z.string())
          .optional()
          .describe('List of channel IDs where the file was shared.'),
        groups: z
          .array(z.string())
          .optional()
          .describe('List of group IDs where the file was shared.'),
        ims: z
          .array(z.string())
          .optional()
          .describe('List of IM IDs where the file was shared.'),
        comments_count: z
          .number()
          .optional()
          .describe('Number of comments on the file.'),
      })
      .passthrough()
      .optional()
      .describe('Information about the uploaded file.'),
    error: z
      .string()
      .optional()
      .describe('Error message if the upload failed.'),
    needed: z
      .string()
      .optional()
      .describe('Scope needed if authorization was insufficient.'),
    provided: z
      .string()
      .optional()
      .describe('Scope that was provided for the request.'),
  })
  .passthrough() // Allow additional fields from Slack API
  .describe('Response from Slack file upload API.');

// Add UpdateMessageSchema
const UpdateMessageSchema = z
  .object({
    channel: z
      .string()
      .describe('The channel containing the message to be updated.'),
    ts: z.string().describe('Timestamp of the message to update.'),
    text: z.string().optional().describe('New text for the message.'),
    blocks: z
      .array(BlockSchema)
      .optional()
      .describe('Array of blocks to update the message with.'),
    attachments: z
      .array(AttachmentSchema)
      .optional()
      .describe('Array of legacy attachments to update the message with.'),
    parse: z
      .enum(['none', 'full'])
      .optional()
      .describe('Change how messages are treated.'),
    link_names: z
      .boolean()
      .optional()
      .describe('Find and link channel names and usernames.'),
    as_user: z
      .boolean()
      .optional()
      .describe('Pass true to update the message as the authed user.'),
  })
  .strict();

// Types
export type BlockText = z.infer<typeof BlockTextSchema>;
export type BlockImage = z.infer<typeof BlockImageSchema>;
export type BlockButton = z.infer<typeof BlockButtonSchema>;
export type BlockSection = z.infer<typeof BlockSectionSchema>;
export type BlockDivider = z.infer<typeof BlockDividerSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type AttachmentField = z.infer<typeof AttachmentFieldSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type SlackMessage = z.infer<typeof SlackMessageSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type SlackMessageResponse = z.infer<typeof SlackMessageResponseSchema>;
export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;
export type UpdateMessage = z.infer<typeof UpdateMessageSchema>;

export const SlackSDKConfigSchema = z.object({
  botToken: z.string().min(1, 'Bot token cannot be empty'),
  authType: z.enum(['header', 'query']).default('header'),
  baseUrl: z.string().url().default('https://slack.com/api').optional(),
});
export type SlackSDKConfig = z.infer<typeof SlackSDKConfigSchema>;

// Helper functions
const createBlockText = (
  text: string,
  type: 'plain_text' | 'mrkdwn' = 'plain_text',
): BlockText => ({
  type,
  text,
});

const createSection = (
  text: string | BlockText,
  fields?: BlockText[],
): BlockSection => ({
  type: 'section',
  text: typeof text === 'string' ? createBlockText(text, 'mrkdwn') : text,
  ...(fields && { fields }),
});

const createDivider = (): BlockDivider => ({
  type: 'divider',
});

const createButton = (
  text: string,
  actionId: string,
  options: Partial<Omit<BlockButton, 'type' | 'text' | 'action_id'>> = {},
): BlockButton => ({
  type: 'button',
  text: createBlockText(text),
  action_id: actionId,
  ...options,
});

// Main SDK implementation
export interface SlackSDK {
  sendMessage: (message: SlackMessage) => Promise<SlackMessageResponse>;
  updateMessage: (message: UpdateMessage) => Promise<SlackMessageResponse>;
  uploadFile: (file: FileUpload) => Promise<FileUploadResponse>;
  blocks: {
    text: typeof createBlockText;
    section: typeof createSection;
    divider: typeof createDivider;
    button: typeof createButton;
  };
}

export const createSlackSDK = (config: SlackSDKConfig): SlackSDK => {
  // Validate the config
  const validatedConfig = SlackSDKConfigSchema.parse(config);
  const { botToken, baseUrl, authType } = validatedConfig;

  const apiUrl = baseUrl || 'https://slack.com/api';

  // Helper to construct request body based on authType
  const constructBody = (data: Record<string, any>) => {
    if (authType === 'query') {
      // Always use FormData for query auth
      const formData = new URLSearchParams();
      formData.append('token', botToken);

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle arrays and objects by stringifying them
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return formData;
    } else {
      // For header auth, use JSON
      return JSON.stringify(data);
    }
  };

  // Get headers based on authType
  const getHeaders = () => {
    const headers: Record<string, string> = {};

    if (authType === 'header') {
      headers['Authorization'] = `Bearer ${botToken}`;
      headers['Content-Type'] = 'application/json';
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return headers;
  };

  return {
    /**
     * Send a message to a Slack channel
     * @see https://slack.com/api/chat.postMessage
     */
    sendMessage: async (
      message: SlackMessage,
    ): Promise<SlackMessageResponse> => {
      const validatedMessage = SlackMessageSchema.parse(message);

      try {
        const response = await fetch(`${apiUrl}/chat.postMessage`, {
          method: 'POST',
          headers: getHeaders(),
          body: constructBody(validatedMessage),
        });

        const data = await response.json();
        return SlackMessageResponseSchema.parse(data);
      } catch (error) {
        throw new Error(
          `Failed to send Slack message: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },

    /**
     * Update an existing message in a Slack channel
     * @see https://slack.com/api/chat.update
     */
    updateMessage: async (
      message: UpdateMessage,
    ): Promise<SlackMessageResponse> => {
      const validatedMessage = UpdateMessageSchema.parse(message);

      try {
        const response = await fetch(`${apiUrl}/chat.update`, {
          method: 'POST',
          headers: getHeaders(),
          body: constructBody(validatedMessage),
        });

        const data = await response.json();
        return SlackMessageResponseSchema.parse(data);
      } catch (error) {
        throw new Error(
          `Failed to update Slack message: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },

    /**
     * Upload a file to Slack
     * @see https://slack.com/api/files.upload
     */
    uploadFile: async (file: FileUpload): Promise<FileUploadResponse> => {
      const validatedFile = FileUploadSchema.parse(file);

      const formData = new FormData();
      Object.entries(validatedFile).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      try {
        const response = await fetch(`${apiUrl}/files.upload`, {
          method: 'POST',
          headers: {
            'content-type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await response.json();
        return FileUploadResponseSchema.parse(data);
      } catch (error) {
        throw new Error(
          `Failed to upload file to Slack: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },

    // Helper functions for creating Block Kit components
    blocks: {
      text: createBlockText,
      section: createSection,
      divider: createDivider,
      button: createButton,
    },
  };
};
