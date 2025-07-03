import { z } from 'zod';

export const TaskStatus = z.enum([
  'in_queue',
  'in_progress',
  'awaiting_input',
  'completed',
  'failed',
  'cancelled',
  'unknown',
]);

export const Task = z.object({
  id: z.string().uuid(),
  parent_task_id: z.string().uuid().nullable(),
  parent_task_options: z.any().nullable(),
  authorization_metadata: z
    .any()
    .nullable()
    .describe('Metadata about the authorization details of the task'),
  source: z.enum(['slack', 'octokit', 'whatsapp', 'unknown']),
  event_type: z.string(),
  payload: z.any(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
      created_at: z.string().datetime(),
      annotations: z.array(z.any()).default([]),
      attachments: z.array(z.any()).default([]),
      parts: z.array(z.any()).default([]),
    }),
  ),
  status: TaskStatus,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  processing_attempts: z.number().int().min(0),
  awaiting_input_timeout: z.string().datetime().nullable(),
  awaiting_input_metadata: z
    .any()
    .nullable()
    .describe(
      'Metadata about the awaiting input of the task - user_input, selection, confirmation',
    ),
  finality_metadata: z
    .any()
    .nullable()
    .describe(
      'Metadata about the finality of the task - failed, cancelled, completed',
    ),
  progress_metadata: z
    .any()
    .nullable()
    .describe('Metadata about the progress of the task'),
});
