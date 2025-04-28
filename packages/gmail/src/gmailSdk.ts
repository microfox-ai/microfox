import { GoogleOAuthSdk } from '@microfox/google-oauth';
import { GmailSdkConfig, Message, Thread, Label, MessageInput } from './types';
import {
  GmailSdkConfigSchema,
  MessageSchema,
  ThreadSchema,
  LabelSchema,
  MessageInputSchema,
} from './schemas/index';

/**
 * Gmail SDK for interacting with Gmail API.
 */
export class GmailSdk {
  private config: GmailSdkConfig;
  private oauthSdk: GoogleOAuthSdk;

  /**
   * Creates an instance of GmailSdk.
   * @param {GmailSdkConfig} config - The configuration for the SDK.
   */
  constructor(config: GmailSdkConfig) {
    this.config = GmailSdkConfigSchema.parse(config);
    this.oauthSdk = new GoogleOAuthSdk({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
    });
  }

  /**
   * Validates the access token and refreshes it if necessary.
   * @private
   */
  private async ensureValidAccessToken(): Promise<void> {
    try {
      const isValid = await this.oauthSdk.validateAccessToken(
        this.config.accessToken,
      );
      if (!isValid) {
        const { accessToken } = await this.oauthSdk.refreshAccessToken(
          this.config.refreshToken,
        );
        this.config.accessToken = accessToken;
      }
    } catch (error) {
      throw new Error(
        `Failed to validate or refresh access token: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Sends a request to the Gmail API.
   * @private
   */
  private async sendRequest(
    method: string,
    endpoint: string,
    body?: object,
  ): Promise<any> {
    await this.ensureValidAccessToken();

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    // For DELETE requests, return true if successful
    if (method === 'DELETE') {
      return true;
    }

    // For other requests, parse the JSON response
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  /**
   * Lists messages in the user's mailbox.
   * @param {string} [query] - The search query to filter messages.
   * @param {number} [maxResults] - Maximum number of messages to return.
   * @returns {Promise<Message[]>} The list of messages.
   */
  async listMessages(
    query?: string,
    maxResults: number = 100,
  ): Promise<Message[]> {
    const response = await this.sendRequest(
      'GET',
      `messages?${query ? `q=${encodeURIComponent(query)}&` : ''}maxResults=${maxResults}`,
    );
    return MessageSchema.array().parse(response.messages);
  }

  /**
   * Gets a message by ID.
   * @param {string} messageId - The ID of the message to retrieve.
   * @returns {Promise<Message>} The message.
   */
  async getMessage(messageId: string): Promise<Message> {
    const response = await this.sendRequest('GET', `messages/${messageId}`);
    return MessageSchema.parse(response);
  }

  /**
   * Lists threads in the user's mailbox.
   * @param {string} [query] - The search query to filter threads.
   * @param {number} [maxResults] - Maximum number of threads to return.
   * @returns {Promise<Thread[]>} The list of threads.
   */
  async listThreads(
    query?: string,
    maxResults: number = 100,
  ): Promise<Thread[]> {
    const response = await this.sendRequest(
      'GET',
      `threads?${query ? `q=${encodeURIComponent(query)}&` : ''}maxResults=${maxResults}`,
    );
    return ThreadSchema.array().parse(response.threads);
  }

  /**
   * Gets a thread by ID.
   * @param {string} threadId - The ID of the thread to retrieve.
   * @returns {Promise<Thread>} The thread.
   */
  async getThread(threadId: string): Promise<Thread> {
    const response = await this.sendRequest('GET', `threads/${threadId}`);
    return ThreadSchema.parse(response);
  }

  /**
   * Lists labels in the user's mailbox.
   * @returns {Promise<Label[]>} The list of labels.
   */
  async listLabels(): Promise<Label[]> {
    const response = await this.sendRequest('GET', 'labels');
    return LabelSchema.array().parse(response.labels);
  }

  /**
   * Creates a new label.
   * @param {Omit<Label, 'id'>} label - The label to create.
   * @returns {Promise<Label>} The created label.
   */
  async createLabel(label: Omit<Label, 'id'>): Promise<Label> {
    const response = await this.sendRequest('POST', 'labels', label);
    return LabelSchema.parse(response);
  }

  /**
   * Updates a label.
   * @param {string} labelId - The ID of the label to update.
   * @param {Partial<Label>} label - The label updates.
   * @returns {Promise<Label>} The updated label.
   */
  async updateLabel(labelId: string, label: Partial<Label>): Promise<Label> {
    const response = await this.sendRequest('PUT', `labels/${labelId}`, label);
    return LabelSchema.parse(response);
  }

  /**
   * Deletes a label.
   * @param {string} labelId - The ID of the label to delete.
   */
  async deleteLabel(labelId: string): Promise<void> {
    await this.sendRequest('DELETE', `labels/${labelId}`);
  }

  /**
   * Sends an email.
   * @param {MessageInput} input - The email input.
   * @returns {Promise<Message>} The sent message.
   */
  async sendEmail(input: MessageInput): Promise<Message> {
    const validatedInput = MessageInputSchema.parse(input);
    const contentType = validatedInput.contentType || 'text/plain';

    // Base headers for all email types
    const baseHeaders = [
      `To: ${validatedInput.to}`,
      `From: ${validatedInput.from}`,
      `Subject: ${validatedInput.subject}`,
      ...(validatedInput.cc ? [`Cc: ${validatedInput.cc.join(', ')}`] : []),
      ...(validatedInput.bcc ? [`Bcc: ${validatedInput.bcc.join(', ')}`] : []),
      'MIME-Version: 1.0',
    ];

    let email: string;

    if (contentType === 'multipart/alternative') {
      const boundary = 'boundary_' + Math.random().toString(36).substring(2);
      const plainText =
        validatedInput.plainTextBody ||
        validatedInput.body.replace(/<[^>]*>/g, '');

      email = [
        ...baseHeaders,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        plainText,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(validatedInput.body).toString('base64'),
        '',
        `--${boundary}--`,
      ].join('\r\n');
    } else if (contentType === 'text/html') {
      email = [
        ...baseHeaders,
        'Content-Type: text/html; charset=utf-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(validatedInput.body).toString('base64'),
      ].join('\r\n');
    } else {
      email = [
        ...baseHeaders,
        'Content-Type: text/plain; charset=utf-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        validatedInput.body,
      ].join('\r\n');
    }

    // Convert to base64url
    const base64Url = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await this.sendRequest('POST', 'messages/send', {
      raw: base64Url,
    });
    return MessageSchema.parse(response);
  }

  /**
   * Modifies the labels of a message.
   * @param {string} messageId - The ID of the message.
   * @param {string[]} addLabelIds - Labels to add.
   * @param {string[]} removeLabelIds - Labels to remove.
   * @returns {Promise<Message>} The modified message.
   */
  async modifyMessageLabels(
    messageId: string,
    addLabelIds: string[] = [],
    removeLabelIds: string[] = [],
  ): Promise<Message> {
    const response = await this.sendRequest(
      'POST',
      `messages/${messageId}/modify`,
      {
        addLabelIds,
        removeLabelIds,
      },
    );
    return MessageSchema.parse(response);
  }

  /**
   * Trashes a message.
   * @param {string} messageId - The ID of the message to trash.
   * @returns {Promise<Message>} The trashed message.
   */
  async trashMessage(messageId: string): Promise<Message> {
    const response = await this.sendRequest(
      'POST',
      `messages/${messageId}/trash`,
    );
    return MessageSchema.parse(response);
  }

  /**
   * Untrashes a message.
   * @param {string} messageId - The ID of the message to untrash.
   * @returns {Promise<Message>} The untrashed message.
   */
  async untrashMessage(messageId: string): Promise<Message> {
    const response = await this.sendRequest(
      'POST',
      `messages/${messageId}/untrash`,
    );
    return MessageSchema.parse(response);
  }
}

/**
 * Creates a new instance of GmailSdk.
 * @param {GmailSdkConfig} config - The configuration for the SDK.
 * @returns {GmailSdk} A new instance of GmailSdk.
 */
export function createGmailSdk(config: GmailSdkConfig): GmailSdk {
  return new GmailSdk(config);
}
