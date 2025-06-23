import { z } from 'zod';

/**
 * An Event Watcher stores a JSONB query to proactively match incoming events.
 * It is filtered by microfox_id, provider, and event type before the JSONB query is checked.
 */
export const EventWatcherSchema = z.object({
  id: z.string().uuid().describe('The unique identifier for the watcher.'),
  task_id: z.string().uuid().describe('The ID of the task this watcher is associated with.'),
  microfox_id: z.string().describe('The project/workspace ID this watcher belongs to.'),
  provider_name: z.string().describe("The name of the originating provider, e.g., 'slack'."),
  event_type: z.string().describe("The type of event to watch for, e.g., 'message'."),
  team_id: z.string().optional().nullable().describe('An optional, specific team ID to scope the watcher to.'),
  organization_id: z.string().optional().nullable().describe('An optional, specific organization ID to scope the watcher to.'),
  match_query: z.record(z.any()).describe('The JSONB query used to match against incoming webhook payloads.'),
  created_at: z.string().datetime().describe('The timestamp when the watcher was created.'),
});
export type EventWatcher = z.infer<typeof EventWatcherSchema>;

/**
 * The required input for creating a new Event Watcher.
 */
export const CreateEventWatcherInputSchema = EventWatcherSchema.pick({
  task_id: true,
  microfox_id: true,
  provider_name: true,
  event_type: true,
  team_id: true,
  organization_id: true,
  match_query: true,
}).describe('The required input for creating a new Event Watcher.');
export type CreateEventWatcherInput = z.infer<typeof CreateEventWatcherInputSchema>; 