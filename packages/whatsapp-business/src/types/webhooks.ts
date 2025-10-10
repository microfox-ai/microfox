import { z } from 'zod';

// Common schemas
const MetadataSchema = z.object({
  display_phone_number: z.string(),
  phone_number_id: z.string(),
});

const ContactProfileSchema = z.object({
  name: z.string(),
});

const ContactSchema = z.object({
  profile: ContactProfileSchema,
  wa_id: z.string(),
});

// Text Message
const TextMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  text: z.object({
    body: z.string(),
  }),
  type: z.literal('text'),
});

// Reaction Message
const ReactionMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  reaction: z.object({
    message_id: z.string(),
    emoji: z.string(),
  }),
  type: z.literal('reaction'),
});

// Media Message
const MediaMessageBaseSchema = z.object({
  mime_type: z.string(),
  sha256: z.string(),
  id: z.string(),
});

const ImageMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('image'),
  image: MediaMessageBaseSchema.extend({
    caption: z.string().optional(),
  }),
});

const StickerMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('sticker'),
  sticker: MediaMessageBaseSchema,
});

const VideoMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('video'),
  video: MediaMessageBaseSchema.extend({
    caption: z.string().optional(),
  }),
});

const DocumentMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('document'),
  document: MediaMessageBaseSchema.extend({
    filename: z.string(),
    caption: z.string().optional(),
  }),
});

const AudioMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('audio'),
  audio: MediaMessageBaseSchema.extend({
    voice: z.boolean(),
  }),
});

// Location Message
const LocationMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('location'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().optional(),
    address: z.string().optional(),
  }),
});

// Contact Message
const ContactAddressSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  state: z.string().optional(),
  street: z.string().optional(),
  type: z.enum(['HOME', 'WORK']),
  zip: z.string().optional(),
});

const ContactEmailSchema = z.object({
  email: z.string(),
  type: z.enum(['HOME', 'WORK']),
});

const ContactNameSchema = z.object({
  formatted_name: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

const ContactOrgSchema = z.object({
  company: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
});

const ContactPhoneSchema = z.object({
  phone: z.string(),
  wa_id: z.string().optional(),
  type: z.enum(['HOME', 'WORK']),
});

const ContactUrlSchema = z.object({
  url: z.string(),
  type: z.enum(['HOME', 'WORK']),
});

const ContactDetailsSchema = z.object({
  addresses: z.array(ContactAddressSchema).optional(),
  birthday: z.string().optional(),
  emails: z.array(ContactEmailSchema).optional(),
  name: ContactNameSchema,
  org: ContactOrgSchema.optional(),
  phones: z.array(ContactPhoneSchema).optional(),
  urls: z.array(ContactUrlSchema).optional(),
});

const ContactMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  contacts: z.array(ContactDetailsSchema),
  type: z.literal('contacts'),
});

// Interactive Messages
const InteractiveMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('interactive'),
  interactive: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('button_reply'),
      button_reply: z.object({
        id: z.string(),
        title: z.string(),
      }),
    }),
    z.object({
      type: z.literal('list_reply'),
      list_reply: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }),
    }),
  ]),
});

// Status Updates
const MessageStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']),
  timestamp: z.string(),
  recipient_id: z.string(),
  conversation: z
    .object({
      id: z.string(),
      expiration_timestamp: z.string().optional(),
      origin: z.object({
        type: z.string(),
      }),
    })
    .optional(),
  pricing: z
    .object({
      billable: z.boolean(),
      pricing_model: z.string(),
      category: z.string(),
    })
    .optional(),
  errors: z
    .array(
      z.object({
        code: z.number(),
        title: z.string(),
        message: z.string().optional(),
        error_data: z
          .object({
            details: z.string(),
          })
          .optional(),
        href: z.string().optional(),
      }),
    )
    .optional(),
});

// Main Webhook Schema
export const WebhookPayloadSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            messaging_product: z.literal('whatsapp'),
            metadata: MetadataSchema,
            contacts: z.array(ContactSchema).optional(),
            messages: z
              .array(
                z.discriminatedUnion('type', [
                  TextMessageSchema,
                  ReactionMessageSchema,
                  ImageMessageSchema,
                  StickerMessageSchema,
                  LocationMessageSchema,
                  ContactMessageSchema,
                  InteractiveMessageSchema,
                  DocumentMessageSchema,
                  AudioMessageSchema,
                  VideoMessageSchema,
                ]),
              )
              .optional(),
            statuses: z.array(MessageStatusSchema).optional(),
          }),
          field: z.literal('messages'),
        }),
      ),
    }),
  ),
});

// Export types
export type WhatsAppWebhookPayload = z.infer<typeof WebhookPayloadSchema>;
export type WhatsAppMessageStatus = z.infer<typeof MessageStatusSchema>;
export type WhatsAppTextMessage = z.infer<typeof TextMessageSchema>;
export type WhatsAppReactionMessage = z.infer<typeof ReactionMessageSchema>;
export type WhatsAppImageMessage = z.infer<typeof ImageMessageSchema>;
export type WhatsAppStickerMessage = z.infer<typeof StickerMessageSchema>;
export type WhatsAppLocationMessage = z.infer<typeof LocationMessageSchema>;
export type WhatsAppContactMessage = z.infer<typeof ContactMessageSchema>;
export type WhatsAppInteractiveMessage = z.infer<
  typeof InteractiveMessageSchema
>;
export type WhatsAppDocumentMessage = z.infer<typeof DocumentMessageSchema>;
export type WhatsAppAudioMessage = z.infer<typeof AudioMessageSchema>;
export type WhatsAppVideoMessage = z.infer<typeof VideoMessageSchema>;
