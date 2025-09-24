import { z } from 'zod';

/**
 * Zod schema for the metadata of a message-type activity.
 * Based on the ChatUIMessage Prisma model.
 */
export const messageMetadataSchema = z.object({
  id: z.string().uuid().describe('The unique identifier for the message.'),
  context: z.string().nullish().describe('Context for the message.'),
  role: z.string().describe('The role of the message sender (e.g., "user", "assistant").'),
  content: z.string().describe('The textual content of the message.'),
  parts: z.array(z.any()).describe('Structured parts of the message content.'),
  attachments: z.array(z.any()).describe('Any attachments with the message.'),
  annotations: z.array(z.any()).describe('Annotations for the message content.'),
  minionId: z.string().nullish().describe('The ID of the minion (AI agent) involved.'),
  minionType: z.string().nullish().describe('The type of the minion.'),
  minionFlow: z.string().nullish().describe('The flow the minion is executing.'),
  userId: z.string().nullish().describe('The ID of the user who sent the message.'),
  createdAt: z.union([z.date(), z.string().datetime()]).describe('The timestamp when the message was created.'),
  updatedAt: z.union([z.date(), z.string().datetime()]).describe('The timestamp when the message was last updated.'),
  originClientRequestId: z.string().describe('The ID of the original client request.'),
  revisionId: z.string().nullish().describe('The revision ID of the message.'),
  toolInvocations: z.array(z.any()).describe('Any tool invocations requested in the message.'),
}).describe('Metadata for an activity of type "message".');


/**
 * Zod schema for an Activity.
 * An activity represents a single event or action within a task, like a message or a tool call.
 */
export const activitySchema = z.object({
  id: z.string().uuid().describe('Unique identifier for the activity.'),
  task_id: z.string().uuid().describe('The task this activity belongs to.'),
  sequence_number: z.number().int().positive().describe('The sequence number of this activity within its task.'),
  parent_activity_id: z.string().uuid().optional().describe('The parent activity, for creating threaded conversations or sub-actions.'),
  prev_activity_id: z.string().uuid().optional().describe('The immediately preceding activity in a sequence.'),
  next_activity_id: z.string().uuid().optional().describe('The immediately succeeding activity in a sequence.'),
  type: z.string().describe('The type of the activity. If "message", specific fields are required.'),
  timestamp: z.union([z.date(), z.string().datetime()]).default(() => new Date()).describe('When the activity occurred.'),
  message_id: z.string().uuid().optional().describe('Direct reference to the message ID, required if the activity type is "message".'),
  message_content: z.string().optional().describe('Direct reference to the message content, required if the activity type is "message".'),
  metadata: z.record(z.string(), z.any()).optional().describe('Generic metadata for the activity.'),
  messageMetadata: messageMetadataSchema.optional().describe('Specific metadata, required if the activity type is "message".'),
  ai_generated_data: z.record(z.string(), z.any()).optional().describe('Data generated for or by AI processes related to this activity.'),
}).superRefine((data, ctx) => {
  if (data.type === 'message') {
    if (!data.messageMetadata) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['messageMetadata'],
        message: 'messageMetadata is required when activity type is "message".',
      });
    }
    if (!data.message_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message_id'],
        message: 'message_id is required when activity type is "message".',
      });
    }
    if (data.message_content === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message_content'],
        message: 'message_content is required when activity type is "message".',
      });
    }
  }
}).describe('A record of an action or event within a task.');

export type Activity = z.infer<typeof activitySchema>;
export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export const CreateActivityInputSchema = activitySchema.omit({ id: true, timestamp: true, sequence_number: true });
export type CreateActivityInput = z.infer<typeof CreateActivityInputSchema>; 