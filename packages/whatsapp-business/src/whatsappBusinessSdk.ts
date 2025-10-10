import {
  WhatsAppSDKConfig,
  AnalyticsOptions,
  TemplateOptions,
  RequestOptions,
  InteractiveMessage,
  LocationObject,
  ContactObject,
  TemplateComponent,
  ConversationalAutomation,
  ConversationalComponentsResponse,
  ApiResponse,
  BusinessProfile,
  BusinessProfileUpdate,
  TemplateData,
  CommerceSettings,
  Flow,
  MediaObject,
  TypingIndicatorOptions,
  TextMessageOptions,
  MessageOptions,
} from './types/index';
import {
  WhatsAppSDKConfigSchema,
  AnalyticsOptionsSchema,
  TemplateOptionsSchema,
  RequestOptionsSchema,
  LocationObjectSchema,
  ContactObjectSchema,
  InteractiveMessageSchema,
  ConversationalAutomationSchema,
  BusinessProfileUpdateSchema,
  TemplateDataSchema,
  CommerceSettingsSchema,
  MediaUploadSchema,
  PhoneRegistrationSchema,
  ReactionSchema,
  FlowSchema,
  ConversationalComponentsResponseSchema,
  MediaObjectSchema,
  TypingIndicatorOptionsSchema,
  TextMessageOptionsSchema,
  MessageOptionsSchema,
} from './schemas';

class WhatsAppBusinessSDKError extends Error {
  code: number;
  originalError: any;

  constructor(message: string, code: number, originalError?: any) {
    super(message);
    this.name = 'WhatsAppBusinessSDKError';
    this.code = code;
    this.originalError = originalError;
  }
}

class WhatsAppBusinessSDK {
  private phoneNumberId: string;
  private businessAccountId: string;
  private version: string;
  private baseUrl: string;
  private accessToken: string;

  constructor(config: WhatsAppSDKConfig) {
    const validatedConfig = WhatsAppSDKConfigSchema.parse(config);
    this.phoneNumberId = validatedConfig.phoneNumberId;
    this.businessAccountId = validatedConfig.businessAccountId;
    this.version = validatedConfig.version || 'v22.0';
    this.baseUrl =
      validatedConfig.baseUrl || `https://graph.facebook.com/${this.version}`;
    this.accessToken = validatedConfig.accessToken;
  }

  /**
   * Send a typing indicator
   * @param {TypingIndicatorOptions} options   - Options for the typing indicator
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendTypingIndicator(
    options: TypingIndicatorOptions,
  ): Promise<ApiResponse> {
    const validatedOptions = TypingIndicatorOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: validatedOptions.messageId,
      typing_indicator: {
        type: validatedOptions.type || 'text',
      },
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a text message
   * @param {string} to - Recipient's phone number in international format
   * @param {string} text - Message text content
   * @param {TextMessageOptions} options - Options for the text message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendTextMessage(
    to: string,
    text: string,
    options: TextMessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedOptions = TextMessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'text',
      text: {
        body: text,
        preview_url: validatedOptions.previewUrl || true,
      },
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send an image message
   * @param {string} to - Recipient's phone number in international format
   * @param {MediaObject} image - Media object with id, link or base64 data
   * @param {MediaMessageOptions} options - Options for the media message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendImageMessage(
    to: string,
    image: MediaObject,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedImage = MediaObjectSchema.parse(image);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'image',
      image: validatedImage,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a video message
   * @param {string} to - Recipient's phone number in international format
   * @param {MediaObject} video - Media object with id, link or base64 data
   * @param {MediaMessageOptions} options - Options for the media message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendVideoMessage(
    to: string,
    video: MediaObject,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedVideo = MediaObjectSchema.parse(video);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'video',
      video: validatedVideo,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a document message
   * @param {string} to - Recipient's phone number in international format
   * @param {MediaObject} document - Media object with id, link or base64 data
   * @param {MessageOptions} options - Options for the document message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendDocumentMessage(
    to: string,
    document: MediaObject,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedDocument = MediaObjectSchema.parse(document);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'document',
      document: validatedDocument,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send an audio message
   * @param {string} to - Recipient's phone number in international format
   * @param {MediaObject} audio - Media object with id, link or base64 data
   * @param {MessageOptions} [options={}] - Additional options
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendAudioMessage(
    to: string,
    audio: MediaObject,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedAudio = MediaObjectSchema.parse(audio);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'audio',
      audio: validatedAudio,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a sticker message
   * @param {string} to - Recipient's phone number in international format
   * @param {MediaObject} sticker - Media object with id, link or base64 data
   * @param {MessageOptions} [options={}] - Additional options
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendStickerMessage(
    to: string,
    sticker: MediaObject,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedSticker = MediaObjectSchema.parse(sticker);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'sticker',
      sticker: validatedSticker,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a location message
   * @param {string} to - Recipient's phone number in international format
   * @param {LocationObject} location - Location object with coordinates and optional name/address
   * @param {MessageOptions} options - Options for the media message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendLocationMessage(
    to: string,
    location: LocationObject,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedLocation = LocationObjectSchema.parse(location);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'location',
      location: validatedLocation,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a contact message
   * @param {string} to - Recipient's phone number in international format
   * @param {ContactObject[]} contacts - Array of contact objects
   * @param {MessageOptions} options - Options for the media message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendContactMessage(
    to: string,
    contacts: ContactObject[],
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedContacts = contacts.map(contact =>
      ContactObjectSchema.parse(contact),
    );
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'contacts',
      contacts: validatedContacts,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send an interactive message (buttons or list)
   * @param {string} to - Recipient's phone number in international format
   * @param {InteractiveMessage} interactive - Interactive message object
   * @param {MediaMessageOptions} options - Options for the media message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendInteractiveMessage(
    to: string,
    interactive: InteractiveMessage,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedInteractive = InteractiveMessageSchema.parse(interactive);
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'interactive',
      interactive: validatedInteractive,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a template message
   * @param {string} to - Recipient's phone number in international format
   * @param {string} templateName - Name of the template
   * @param {string} language - Language code
   * @param {TemplateComponent[]} [components=[]] - Template components
   * @param {MessageOptions} options - Options for the media message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    language: string,
    components: TemplateComponent[] = [],
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: language,
        },
        components,
      },
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Mark a message as read
   * @param {string} messageId - ID of the message to mark as read
   * @returns {Promise<ApiResponse>} - API response
   */
  async markMessageAsRead(messageId: string): Promise<ApiResponse> {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Upload media to WhatsApp servers
   * @param {File|Blob} media - Media file to upload
   * @param {string} type - Media type (image, document, audio, video, sticker)
   * @returns {Promise<ApiResponse>} - API response with media ID
   */
  async uploadMedia(media: File | Blob, type: string): Promise<ApiResponse> {
    const validatedData = MediaUploadSchema.parse({
      messaging_product: 'whatsapp',
      file: media,
      type,
    });

    const formData = new FormData();
    formData.append('messaging_product', validatedData.messaging_product);
    formData.append('file', validatedData.file);
    formData.append('type', validatedData.type);

    return this._makeRequest(`/${this.phoneNumberId}/media`, 'POST', formData, {
      isFormData: true,
    });
  }

  /**
   * Download media from WhatsApp servers
   * @param {string} mediaId - ID of the media to download
   * @returns {Promise<ApiResponse>} - API response with media data
   */
  async downloadMedia(mediaId: string): Promise<ApiResponse> {
    const mediaUrlResponse = await this.getMediaUrl(mediaId);
    const mediaUrl = mediaUrlResponse.data.url;

    const mediaResponse = await fetch(mediaUrl, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json();
      throw new WhatsAppBusinessSDKError(
        errorData.error?.message || 'Failed to download media',
        errorData.error?.code || mediaResponse.status,
        errorData,
      );
    }

    const mediaData = await mediaResponse.arrayBuffer();

    return {
      success: true,
      data: mediaData,
    };
  }

  /**
   * Get media URL from WhatsApp servers
   * @param {string} mediaId - ID of the media
   * @returns {Promise<ApiResponse>} - API response with media URL
   */
  async getMediaUrl(mediaId: string): Promise<ApiResponse> {
    return this._makeRequest(`/${mediaId}`, 'GET');
  }

  /**
   * Register a phone number
   * @param {string} phoneNumber - Phone number to register
   * @param {string} pin - PIN code
   * @returns {Promise<ApiResponse>} - API response
   */
  async registerPhone(phoneNumber: string, pin: string): Promise<ApiResponse> {
    const validatedData = PhoneRegistrationSchema.parse({
      messaging_product: 'whatsapp',
      pin,
    });

    return this._makeRequest(`/${phoneNumber}/register`, 'POST', validatedData);
  }

  /**
   * Deregister a phone number
   * @param {string} phoneNumber - Phone number to deregister
   * @returns {Promise<ApiResponse>} - API response
   */
  async deregisterPhone(phoneNumber: string): Promise<ApiResponse> {
    return this._makeRequest(`/${phoneNumber}/deregister`, 'POST', {
      messaging_product: 'whatsapp',
    });
  }

  /**
   * Get business profile information
   * @returns {Promise<BusinessProfile>} - Business profile data
   */
  async getBusinessProfile(): Promise<BusinessProfile> {
    const response = await this._makeRequest(
      `/${this.phoneNumberId}/whatsapp_business_profile`,
      'GET',
    );
    return response.data;
  }

  /**
   * Update business profile information
   * @param {BusinessProfileUpdate} profileData - Business profile data to update
   * @returns {Promise<BusinessProfile>} - Updated business profile data
   */
  async updateBusinessProfile(
    profileData: BusinessProfileUpdate,
  ): Promise<BusinessProfile> {
    const validatedData = BusinessProfileUpdateSchema.parse(profileData);
    const data = {
      messaging_product: 'whatsapp',
      ...validatedData,
    };

    const response = await this._makeRequest(
      `/${this.phoneNumberId}/whatsapp_business_profile`,
      'POST',
      data,
    );
    return response.data;
  }

  /**
   * Get a list of templates
   * @param {TemplateOptions} [options={}] - Additional options like limit, offset
   * @returns {Promise<ApiResponse>} - API response with templates
   */
  async getTemplates(
    options: TemplateOptions = { limit: 20, offset: 0 },
  ): Promise<ApiResponse> {
    const validatedOptions = TemplateOptionsSchema.parse(options);
    const queryParams = new URLSearchParams({
      limit: validatedOptions.limit.toString(),
      offset: validatedOptions.offset.toString(),
    }).toString();

    return this._makeRequest(
      `/${this.businessAccountId}/message_templates?${queryParams}`,
      'GET',
    );
  }

  /**
   * Create a new template
   * @param {TemplateData} templateData - Template data
   * @returns {Promise<ApiResponse>} - API response
   */
  async createTemplate(templateData: TemplateData): Promise<ApiResponse> {
    const validatedData = TemplateDataSchema.parse(templateData);
    const data = {
      name: validatedData.name,
      category: validatedData.category,
      components: validatedData.components,
      language: validatedData.language,
    };

    return this._makeRequest(
      `/${this.businessAccountId}/message_templates`,
      'POST',
      data,
    );
  }

  /**
   * Delete a template
   * @param {string} templateName - Name of the template to delete
   * @returns {Promise<ApiResponse>} - API response
   */
  async deleteTemplate(templateName: string): Promise<ApiResponse> {
    return this._makeRequest(
      `/${this.businessAccountId}/message_templates?name=${templateName}`,
      'DELETE',
    );
  }

  /**
   * Get the QR code for a phone number
   * @returns {Promise<ApiResponse>} - API response with QR code data
   */
  async getQRCode(): Promise<ApiResponse> {
    return this._makeRequest(`/${this.phoneNumberId}/qr_code`, 'GET');
  }

  /**
   * Get phone numbers in the business account
   * @returns {Promise<ApiResponse>} - API response with phone numbers
   */
  async getPhoneNumbers(): Promise<ApiResponse> {
    return this._makeRequest(`/${this.businessAccountId}/phone_numbers`, 'GET');
  }

  /**
   * Get analytics for a phone number
   * @param {AnalyticsOptions} [options={}] - Query parameters
   * @returns {Promise<ApiResponse>} - API response with analytics data
   */
  async getAnalytics(
    options: AnalyticsOptions = { granularity: 'DAY' },
  ): Promise<ApiResponse> {
    const validatedOptions = AnalyticsOptionsSchema.parse(options);
    const queryParams = new URLSearchParams({
      start: validatedOptions.start || '',
      end: validatedOptions.end || '',
      granularity: validatedOptions.granularity,
    }).toString();

    return this._makeRequest(
      `/${this.phoneNumberId}/insights?${queryParams}`,
      'GET',
    );
  }

  /**
   * Get the WhatsApp Commerce account settings
   * @returns {Promise<CommerceSettings>} - Commerce settings data
   */
  async getCommerceSettings(): Promise<CommerceSettings> {
    const response = await this._makeRequest(
      `/${this.businessAccountId}/whatsapp_commerce_settings`,
      'GET',
    );
    return response.data;
  }

  /**
   * Update the WhatsApp Commerce account settings
   * @param {CommerceSettings} settings - Settings to update
   * @returns {Promise<CommerceSettings>} - Updated commerce settings data
   */
  async updateCommerceSettings(
    settings: CommerceSettings,
  ): Promise<CommerceSettings> {
    const validatedSettings = CommerceSettingsSchema.parse(settings);
    const response = await this._makeRequest(
      `/${this.businessAccountId}/whatsapp_commerce_settings`,
      'POST',
      validatedSettings,
    );
    return response.data;
  }

  /**
   * Configure conversational components for a phone number
   * @param {ConversationalAutomation} config - Configuration for conversational components
   * @returns {Promise<ApiResponse>} - API response
   * @throws {WhatsAppBusinessSDKError} - If WHATSAPP_WEBHOOK_URL is not set
   */
  async configureConversationalComponents(
    config: ConversationalAutomation,
  ): Promise<ApiResponse> {
    if (!process.env.WHATSAPP_WEBHOOK_URL) {
      throw new WhatsAppBusinessSDKError(
        'Webhook URL is required for conversational components',
        400,
      );
    }

    const validatedConfig = ConversationalAutomationSchema.parse(config);
    return this._makeRequest(
      `/${this.phoneNumberId}/conversational_automation`,
      'POST',
      validatedConfig,
    );
  }

  /**
   * Get current conversational components configuration
   * @returns {Promise<ConversationalComponentsResponse>} - Current configuration
   */
  async getConversationalComponents(): Promise<ConversationalComponentsResponse> {
    const response = await this._makeRequest(
      `/${this.phoneNumberId}?fields=conversational_automation`,
      'GET',
    );
    return ConversationalComponentsResponseSchema.parse(response);
  }

  /**
   * Send an interactive Call-To-Action URL message
   * @param {string} to - Recipient's phone number in international format
   * @param {string} text - Message text content
   * @param {string} url - Call-to-action URL
   * @param {MessageOptions} options - Options for the message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendInteractiveCtaMessage(
    to: string,
    text: string,
    url: string,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'interactive',
      interactive: {
        type: 'cta',
        body: {
          text,
        },
        action: {
          url,
        },
      },
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send an interactive Flow message
   * @param {string} to - Recipient's phone number in international format
   * @param {Flow} flow - Flow configuration
   * @param {MessageOptions} options - Options for the message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendFlowMessage(
    to: string,
    flow: Flow,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedOptions = MessageOptionsSchema.parse(options);
    const validatedFlow = FlowSchema.parse(flow);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'interactive',
      interactive: {
        type: 'flow',
        ...(validatedFlow.header && { header: validatedFlow.header }),
        ...(validatedFlow.body && { body: validatedFlow.body }),
        ...(validatedFlow.footer && { footer: validatedFlow.footer }),
        action: {
          name: 'flow',
          parameters: {
            flow_token: validatedFlow.token,
            ...validatedFlow.parameters,
          },
        },
      },
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a location request message
   * @param {string} to - Recipient's phone number in international format
   * @param {string} text - Message text content
   * @param {MessageOptions} options - Options for the message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendLocationRequestMessage(
    to: string,
    text: string,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      type: 'interactive',
      interactive: {
        type: 'location_request_message',
        body: {
          text,
        },
        action: {
          name: 'send_location',
        },
      },
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a reaction to a message
   * @param {string} to - Recipient's phone number in international format
   * @param {string} messageId - ID of the message to react to
   * @param {string} emoji - Emoji to react with
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendReaction(
    to: string,
    messageId: string,
    emoji: string,
  ): Promise<ApiResponse> {
    const validatedReaction = ReactionSchema.parse({
      message_id: messageId,
      emoji,
    });
    const data = {
      messaging_product: 'whatsapp',
      to,
      type: 'reaction',
      reaction: validatedReaction,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Send a reply to a specific message
   * @param {string} to - Recipient's phone number in international format
   * @param {'text' | 'image' | 'video' | 'document' | 'audio' | 'sticker' | 'location' | 'contacts' | 'interactive'} type - Type of message
   * @param {string | ImageObject | VideoObject | DocumentObject | AudioObject | StickerObject | LocationObject | ContactObject[] | InteractiveMessage} content - Content of the message based on type
   * @param {string} messageId - ID of the message to reply to
   * @param {MessageOptions} options - Options for the message
   * @returns {Promise<ApiResponse>} - API response
   */
  async sendReply(
    to: string,
    type:
      | 'text'
      | 'image'
      | 'video'
      | 'document'
      | 'audio'
      | 'sticker'
      | 'location'
      | 'contacts'
      | 'interactive',
    content: string | MediaObject,
    messageId: string,
    options: MessageOptions = { recipientType: 'individual' },
  ): Promise<ApiResponse> {
    const validatedOptions = MessageOptionsSchema.parse(options);
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: validatedOptions.recipientType,
      to,
      context: {
        message_id: messageId,
      },
      type,
      [type]: type === 'text' ? { body: content } : content,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Mark messages as read
   * @param {string[]} messageIds - IDs of the messages to mark as read
   * @returns {Promise<ApiResponse>} - API response
   */
  async markMessagesAsRead(messageIds: string[]): Promise<ApiResponse> {
    const data = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_ids: messageIds,
    };

    return this._makeRequest(`/${this.phoneNumberId}/messages`, 'POST', data);
  }

  /**
   * Make a request to the WhatsApp API
   * @private
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {any} data - Request data
   * @param {RequestOptions} [options={ }] - Additional options
   * @returns {Promise<ApiResponse>} - API response
   */
  private async _makeRequest(
    endpoint: string,
    method: string,
    data: any = null,
    options: RequestOptions = { isFormData: false },
  ): Promise<ApiResponse> {
    const validatedOptions = RequestOptionsSchema.parse(options);
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    if (data && !validatedOptions.isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (validatedOptions.isFormData) {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(url, requestOptions);
      const responseJSON = await response.json();
      const responseData = {
        success: response.ok,
        message: responseJSON.message,
        error: responseJSON.error,
        data: responseJSON,
      };

      if (!response.ok) {
        throw new WhatsAppBusinessSDKError(
          responseData.error?.message || 'Unknown error',
          responseData.error?.code || response.status,
          responseData,
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof WhatsAppBusinessSDKError) {
        throw error;
      }
      throw new WhatsAppBusinessSDKError('Network error', 0, error);
    }
  }
}

// Export the WhatsApp SDK
export { WhatsAppBusinessSDK, WhatsAppBusinessSDKError };
