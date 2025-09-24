import { z } from 'zod';

export const EventStatus = z.enum(['unclassified', 'classified', 'failed']);

export const EventSchema = z.object({
  id: z.string().uuid().describe('The unique identifier for the event.'),
  microfox_ids: z.array(z.string()).describe('The project/workspace IDs this event is associated with.'),
  created_at: z.string().datetime().describe('The timestamp when the event was logged.'),
  provider_name: z.string().optional().nullable().describe("The name of the originating provider, e.g., 'slack', 'stripe'."),
  provider_event_id: z.string().optional().nullable().describe("The native event ID from the provider for deduplication."),
  event_type: z.string().describe("The type of event, e.g., 'message', 'reaction_added', 'payment.succeeded'."),
  status: EventStatus.describe('The processing status of the event.'),
  content: z.string().optional().nullable().describe('The text content of the event, typically for messages.'),
  metadata: z.record(z.string(), z.any()).optional().nullable().describe('A flexible field for storing the full, raw event payload or other data.'),
  classification_notes: z.string().optional().nullable().describe('Notes added during processing, explaining why an event was classified a certain way or failed.'),
});
export type Event = z.infer<typeof EventSchema>;

export const LogEventInputSchema = EventSchema.omit({
  id: true,
  created_at: true,
  status: true,
}).describe('The required input for logging a new event.');
export type LogEventInput = z.infer<typeof LogEventInputSchema>; 