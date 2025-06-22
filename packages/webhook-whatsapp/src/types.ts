import { z } from 'zod';

export const WhatsAppMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  text: z.object({
    body: z.string(),
  }),
  type: z.string(),
});

export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;

export const WhatsAppValueSchema = z.object({
  messaging_product: z.string(),
  metadata: z.object({
    display_phone_number: z.string(),
    phone_number_id: z.string(),
  }),
  contacts: z.array(z.object({
    profile: z.object({
        name: z.string()
    }),
    wa_id: z.string()
  })).optional(),
  messages: z.array(WhatsAppMessageSchema).optional(),
});

export type WhatsAppValue = z.infer<typeof WhatsAppValueSchema>;

export const WhatsAppEntrySchema = z.object({
  id: z.string(),
  changes: z.array(z.object({
    value: WhatsAppValueSchema,
    field: z.string(),
  })),
});

export type WhatsAppEntry = z.infer<typeof WhatsAppEntrySchema>;

export const WhatsAppWebhookPayloadSchema = z.object({
  object: z.string(),
  entry: z.array(WhatsAppEntrySchema),
});

export type WhatsAppWebhookPayload = z.infer<typeof WhatsAppWebhookPayloadSchema>; 