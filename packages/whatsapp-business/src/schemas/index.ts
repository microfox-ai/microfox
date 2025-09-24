import { z } from 'zod';

// Base configuration schema
export const WhatsAppSDKConfigSchema = z.object({
  phoneNumberId: z
    .string()
    .min(1)
    .describe('The phone number ID for WhatsApp Business API'),
  businessAccountId: z
    .string()
    .min(1)
    .describe('The business account ID for WhatsApp Business API'),
  version: z
    .string()
    .optional()
    .describe('The API version to use')
    .default('v22.0'),
  baseUrl: z.string().optional().describe('The base URL for the API'),
  accessToken: z
    .string()
    .min(1)
    .describe('The access token for WhatsApp Business API'),
});

// Receipient Type Schema
export const ReceipientTypeSchema = z.enum(['individual', 'group']);

// Message Options Schema
export const MessageOptionsSchema = z
  .object({
    recipientType: ReceipientTypeSchema.describe('The type of recipient'),
  })
  .describe('The options for the message');

// Text Message Options Schema
export const TextMessageOptionsSchema = MessageOptionsSchema.extend({
  previewUrl: z.boolean().optional().describe('Whether to show a preview URL'),
});

// Typing Indicator Options Schema
export const TypingIndicatorOptionsSchema = z.object({
  messageId: z.string().describe('ID of the message to mark as read'),
  type: z.enum(['text']).optional().describe('Type of typing indicator'),
});

// Context schema for message replies
export const ContextSchema = z.object({
  message_id: z
    .string()
    .describe(
      'WhatsApp message ID (wamid) of the previous message to reply to',
    ),
});

// Media object schemas
export const MediaObjectSchema = z.object({
  id: z
    .string()
    .optional()
    .describe('ID of the media object. Only used for media upload'),
  link: z
    .string()
    .url()
    .optional()
    .describe('URL of the media object. Only if using hosted media'),
  caption: z
    .string()
    .optional()
    .describe(
      'Caption for the media object. Only for images, videos and documents',
    ),
  filename: z.string().optional().describe('Name of the media file'),
});

// Location and contact schemas
export const LocationObjectSchema = z.object({
  longitude: z.number().describe('Longitude coordinate of the location'),
  latitude: z.number().describe('Latitude coordinate of the location'),
  name: z.string().optional().describe('Name of the location'),
  address: z.string().optional().describe('Address of the location'),
});

export const ContactObjectSchema = z.object({
  name: z
    .object({
      formatted_name: z.string().describe('Full formatted name of the contact'),
      first_name: z.string().optional().describe('First name of the contact'),
      last_name: z.string().optional().describe('Last name of the contact'),
      middle_name: z.string().optional().describe('Middle name of the contact'),
      suffix: z.string().optional().describe('Name suffix of the contact'),
      prefix: z.string().optional().describe('Name prefix of the contact'),
    })
    .describe('Name information of the contact'),
  phones: z
    .array(
      z.object({
        phone: z.string().describe('Phone number of the contact'),
        type: z
          .enum(['CELL', 'MAIN', 'IPHONE', 'HOME', 'WORK'])
          .optional()
          .describe('Type of phone number'),
        wa_id: z.string().optional().describe('WhatsApp ID of the contact'),
      }),
    )
    .describe('Phone numbers of the contact'),
  emails: z
    .array(
      z.object({
        email: z.string().email().describe('Email address of the contact'),
        type: z
          .enum(['HOME', 'WORK'])
          .optional()
          .describe('Type of email address'),
      }),
    )
    .optional()
    .describe('Email addresses of the contact'),
  urls: z
    .array(
      z.object({
        url: z.string().url().describe('URL associated with the contact'),
        type: z.enum(['HOME', 'WORK']).optional().describe('Type of URL'),
      }),
    )
    .optional()
    .describe('URLs associated with the contact'),
  addresses: z
    .array(
      z.object({
        street: z.string().optional().describe('Street address'),
        city: z.string().optional().describe('City name'),
        state: z.string().optional().describe('State or province'),
        zip: z.string().optional().describe('ZIP or postal code'),
        country: z.string().optional().describe('Country name'),
        country_code: z.string().optional().describe('Country code'),
        type: z.enum(['HOME', 'WORK']).optional().describe('Type of address'),
      }),
    )
    .optional()
    .describe('Addresses of the contact'),
  org: z
    .object({
      company: z.string().optional().describe('Company name'),
      department: z.string().optional().describe('Department name'),
      title: z.string().optional().describe('Job title'),
    })
    .optional()
    .describe('Organization information'),
  birthday: z.string().optional().describe('Birthday in YYYY-MM-DD format'),
});

// Interactive message schemas
export const ButtonSchema = z.object({
  type: z
    .enum(['reply', 'url', 'phone_number', 'flow'])
    .describe('Type of button'),
  reply: z
    .object({
      id: z.string().describe('Unique identifier for the button'),
      title: z.string().describe('Button title'),
    })
    .optional()
    .describe('Reply button configuration'),
  url: z
    .object({
      target: z.string().url().describe('URL to open when button is clicked'),
      display_text: z.string().describe('Text to display for the URL button'),
    })
    .optional()
    .describe('URL button configuration'),
  phone_number: z
    .object({
      number: z.string().describe('Phone number to call'),
      display_text: z.string().describe('Text to display for the phone button'),
    })
    .optional()
    .describe('Phone number button configuration'),
  flow: z
    .object({
      id: z.string().describe('Flow ID'),
      tracking_data: z
        .string()
        .optional()
        .describe('Tracking data for the flow'),
      params: z.array(z.string()).optional().describe('Flow parameters'),
    })
    .optional()
    .describe('Flow button configuration'),
});

export const ListSectionSchema = z.object({
  title: z.string().describe('Title of the list section'),
  rows: z
    .array(
      z.object({
        id: z.string().describe('Unique identifier for the row'),
        title: z.string().describe('Title of the row'),
        description: z.string().optional().describe('Description of the row'),
      }),
    )
    .describe('List of rows in the section'),
});

export const FlowActionPayloadSchema = z.object({
  screen: z
    .string()
    .optional()
    .describe('The id of the first screen. Default is FIRST_ENTRY_SCREEN'),
  data: z
    .record(z.string(), z.any())
    .optional()
    .describe(
      'Optional. The input data for the first screen of the Flow. Must be a non-empty object',
    ),
});

export const FlowParametersSchema = z.object({
  flow_message_version: z.literal('3').describe('Value must be 3'),
  flow_id: z
    .string()
    .optional()
    .describe(
      'Unique ID of the Flow provided by WhatsApp. Cannot be used with flow_name',
    ),
  flow_name: z
    .string()
    .optional()
    .describe(
      'The name of the Flow that you created. Cannot be used with flow_id',
    ),
  flow_cta: z
    .string()
    .max(30)
    .describe(
      'Text on the CTA button. For example: "Signup". Max 30 characters, no emoji',
    ),
  mode: z
    .enum(['draft', 'published'])
    .optional()
    .default('published')
    .describe('The Flow can be in either draft or published mode'),
  flow_token: z
    .string()
    .optional()
    .describe(
      'Flow token that is generated by the business to serve as an identifier',
    ),
  flow_action: z
    .enum(['navigate', 'data_exchange'])
    .optional()
    .default('navigate')
    .describe('navigate or data_exchange'),
  flow_action_payload: FlowActionPayloadSchema.optional().describe(
    'Required if flow_action is navigate. Should be omitted otherwise',
  ),
});

export const CtaUrlParametersSchema = z.object({
  display_text: z.string().describe('Button text'),
  url: z
    .string()
    .url()
    .describe("URL to load in the device's default web browser when tapped"),
});

export const InteractiveMessageSchema = z.object({
  type: z
    .enum(['button', 'list', 'cta_url', 'location_request'])
    .describe('Type of interactive message'),
  header: z
    .object({
      type: z
        .enum(['text', 'image', 'video', 'document'])
        .describe('Type of header content'),
      text: z.string().optional().describe('Header text content'),
      image: MediaObjectSchema.optional().describe('Header image'),
      video: MediaObjectSchema.optional().describe('Header video'),
      document: MediaObjectSchema.optional().describe('Header document'),
    })
    .optional()
    .describe('Header content of the interactive message'),
  body: z
    .object({
      text: z.string().describe('Main text content of the message'),
    })
    .describe('Body content of the interactive message'),
  footer: z
    .object({
      text: z.string().describe('Footer text content'),
    })
    .optional()
    .describe('Footer content of the interactive message'),
  action: z
    .object({
      name: z
        .enum(['cta_url'])
        .optional()
        .describe('Name of the action (cta_url)'),
      parameters: CtaUrlParametersSchema.optional().describe(
        'Parameters for the action',
      ),
      buttons: z
        .array(ButtonSchema)
        .optional()
        .describe('List of buttons for non-cta messages'),
      button: z
        .string()
        .optional()
        .describe('Single button text for non-cta messages'),
      sections: z
        .array(ListSectionSchema)
        .optional()
        .describe('List of sections for non-cta messages'),
      url: z
        .string()
        .url()
        .optional()
        .describe('URL for CTA button for non-cta messages'),
      location_request: z
        .object({
          current_location: z
            .boolean()
            .optional()
            .describe('Whether to request current location'),
          location_types: z
            .array(z.string())
            .optional()
            .describe('Types of locations to request'),
        })
        .optional()
        .describe('Location request configuration'),
    })
    .describe('Action configuration for the interactive message'),
});

// Reaction schema
export const ReactionSchema = z.object({
  message_id: z.string().describe('ID of the message to react to'),
  emoji: z.string().describe('Emoji to use for the reaction'),
});

// Reply context schema
export const ReplyContextSchema = z.object({
  message_id: z.string().describe('ID of the message being replied to'),
  forwarded: z
    .boolean()
    .optional()
    .describe('Whether the message was forwarded'),
  quoted: z
    .boolean()
    .optional()
    .describe('Whether to quote the original message'),
});

// Flow schema
export const FlowSchema = z.object({
  id: z.string().describe('ID of the flow'),
  token: z
    .string()
    .describe(
      'Flow token that is generated by the business to serve as an identifier',
    ),
  header: z
    .object({
      type: z.literal('text'),
      text: z.string(),
    })
    .describe('Header of the flow message'),
  body: z
    .object({
      text: z.string(),
    })
    .describe('Body of the flow message'),
  footer: z
    .object({
      text: z.string(),
    })
    .describe('Footer of the flow message'),
  parameters: z
    .object({
      mode: z
        .literal('draft')
        .default('draft')
        .describe('The Flow can be in either draft or published mode'),
      flow_message_version: z
        .literal('3')
        .default('3')
        .describe('Value must be 3'),
      flow_id: z
        .string()
        .describe('Unique ID of the Flow provided by WhatsApp'),
      flow_cta: z
        .string()
        .max(30)
        .describe('Text on the CTA button. Max 30 characters, no emoji'),
      flow_action: z
        .enum(['navigate', 'data_exchange'])
        .default('navigate')
        .describe('navigate or data_exchange'),
      flow_action_payload: z
        .object({
          screen: z
            .string()
            .default('FIRST_ENTRY_SCREEN')
            .describe(
              'The id of the first screen. Default is FIRST_ENTRY_SCREEN',
            ),
          data: z
            .record(z.string(), z.any())
            .optional()
            .describe(
              'Optional. The input data for the first screen of the Flow',
            ),
        })
        .optional()
        .describe(
          'Required if flow_action is navigate. Should be omitted otherwise',
        ),
    })
    .describe('Flow parameters'),
});

// Template message schemas
export const TemplateComponentSchema = z.object({
  type: z
    .enum(['header', 'body', 'footer', 'buttons'])
    .describe('Type of template component'),
  parameters: z
    .array(
      z.object({
        type: z
          .enum(['text', 'currency', 'date_time', 'image', 'document', 'video'])
          .describe('Type of parameter'),
        text: z.string().optional().describe('Text parameter value'),
        currency: z
          .object({
            fallback_value: z.string().describe('Fallback value for currency'),
            code: z.string().describe('Currency code'),
            amount_1000: z.number().describe('Amount in thousandths'),
          })
          .optional()
          .describe('Currency parameter value'),
        date_time: z
          .object({
            fallback_value: z.string().describe('Fallback value for date/time'),
          })
          .optional()
          .describe('Date/time parameter value'),
        image: MediaObjectSchema.optional().describe('Image parameter value'),
        document: MediaObjectSchema.optional().describe(
          'Document parameter value',
        ),
        video: MediaObjectSchema.optional().describe('Video parameter value'),
      }),
    )
    .describe('Parameters for the template component'),
});

// Analytics and template options schemas
export const AnalyticsOptionsSchema = z.object({
  start: z
    .string()
    .optional()
    .describe('Start date for analytics in YYYY-MM-DD format'),
  end: z
    .string()
    .optional()
    .describe('End date for analytics in YYYY-MM-DD format'),
  granularity: z
    .enum(['HOUR', 'DAY', 'MONTH'])
    .optional()
    .describe('Granularity of the analytics data')
    .default('DAY'),
});

export const TemplateOptionsSchema = z.object({
  limit: z
    .number()
    .optional()
    .describe('Maximum number of templates to return')
    .default(20),
  offset: z.number().optional().describe('Offset for pagination').default(0),
});

// Conversational automation schemas
export const CommandSchema = z.object({
  command_name: z.string().describe('Name of the command'),
  command_description: z
    .string()
    .describe('Description of what the command does'),
});

export const ConversationalAutomationSchema = z.object({
  enable_welcome_message: z
    .boolean()
    .optional()
    .describe('Whether to enable the welcome message'),
  commands: z
    .array(CommandSchema)
    .optional()
    .describe('List of commands to be configured'),
  prompts: z
    .array(z.string())
    .optional()
    .describe('List of prompts to be configured'),
});

export const ConversationalComponentsResponseSchema = z.object({
  conversational_automation: z.object({
    enable_welcome_message: z
      .boolean()
      .describe('Whether the welcome message is enabled'),
    prompts: z.array(z.string()).describe('List of configured prompts'),
    commands: z.array(CommandSchema).describe('List of configured commands'),
  }),
  id: z.string().describe('ID of the phone number'),
});

// Request options schema
export const RequestOptionsSchema = z.object({
  isFormData: z
    .boolean()
    .optional()
    .describe('Whether the request contains form data')
    .default(false),
});

// Business profile schemas
export const BusinessProfileSchema = z.object({
  messaging_product: z.literal('whatsapp').describe('Messaging product type'),
  address: z.string().optional().describe('Business address'),
  description: z.string().optional().describe('Business description'),
  vertical: z.string().optional().describe('Business vertical'),
  email: z.string().email().optional().describe('Business email'),
  websites: z.array(z.string().url()).optional().describe('Business websites'),
  profile_picture_url: z
    .string()
    .url()
    .optional()
    .describe('URL of the business profile picture'),
  about: z.string().optional().describe('About text for the business'),
});

export const BusinessProfileUpdateSchema = BusinessProfileSchema.omit({
  messaging_product: true,
});

// Template schemas
export const TemplateDataSchema = z.object({
  name: z.string().describe('Name of the template'),
  category: z
    .enum(['AUTHENTICATION', 'MARKETING', 'UTILITY'])
    .describe('Category of the template'),
  components: z
    .array(TemplateComponentSchema)
    .describe('Components of the template'),
  language: z.string().describe('Language of the template'),
});

// Commerce settings schemas
export const CommerceSettingsSchema = z.object({
  is_catalog_visible: z.boolean().describe('Whether the catalog is visible'),
  is_cart_enabled: z.boolean().describe('Whether the cart is enabled'),
  catalog_id: z.string().optional().describe('ID of the catalog'),
  cart_expiration_time: z
    .number()
    .optional()
    .describe('Cart expiration time in minutes'),
  cart_abandoned_time: z
    .number()
    .optional()
    .describe('Cart abandoned time in minutes'),
});

// Media upload schemas
export const MediaUploadSchema = z.object({
  messaging_product: z.literal('whatsapp').describe('Messaging product type'),
  file: z
    .instanceof(File)
    .or(z.instanceof(Blob))
    .describe('Media file to upload'),
  type: z
    .enum(['image', 'video', 'document', 'audio', 'sticker'])
    .describe('Type of media file'),
});

// Phone registration schemas
export const PhoneRegistrationSchema = z.object({
  messaging_product: z.literal('whatsapp').describe('Messaging product type'),
  pin: z.string().min(4).max(6).describe('PIN code for registration'),
});

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean().describe('Whether the request was successful'),
  message: z.string().optional().describe('Response message'),
  data: z.any().optional().describe('Response data'),
  error: z
    .object({
      code: z.number().describe('Error code'),
      message: z.string().describe('Error message'),
      details: z.any().optional().describe('Error details'),
    })
    .optional()
    .describe('Error information'),
});
